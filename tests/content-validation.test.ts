import assert from 'node:assert/strict'
import test from 'node:test'
import type { TopicVariant } from '../src/domain/content-types.ts'
import { categories } from '../src/content/categories.ts'
import { levels } from '../src/content/levels.ts'
import { topics } from '../src/content/topics/index.ts'
import { validateTopics } from '../src/validation/content-validation.ts'
import { makeTestTopic } from './fixtures/topic.ts'

function rejectsVariant(change: (variant: TopicVariant) => void, expectedPath: string) {
  const topic = makeTestTopic()
  const variant = topic.variants.basic
  assert.ok(variant)
  change(variant)
  const result = validateTopics([topic])
  assert.equal(result.ok, false)
  assert.ok(result.issues.some((issue) => issue.path.includes(expectedPath)), JSON.stringify(result.issues))
}

test('the published catalog is valid; all categories and levels exist', () => {
  assert.deepEqual(topics.map((topic) => topic.id), ['personality', 'smile', 'waiting-in-a-queue'])
  assert.equal(validateTopics(topics).ok, true)
  assert.equal(categories.length, 5)
  assert.deepEqual(levels.map((level) => [level.id, level.cefr.join('/')]), [['basic', 'A1/A2'], ['standard', 'A2/B1'], ['challenge', 'B1/B2']])
})

test('the Stage 3 catalog contains exactly nine complete lesson variants', () => {
  assert.equal(topics.reduce((count, topic) => count + Object.keys(topic.variants).length, 0), 9)
  for (const topic of topics) {
    assert.deepEqual(Object.keys(topic.variants).sort(), ['basic', 'challenge', 'standard'])
    for (const level of ['basic', 'standard', 'challenge'] as const) {
      const variant = topic.variants[level]
      assert.ok(variant)
      assert.equal(variant.exercises.length, 4)
      assert.ok(variant.vocabulary.length >= 3)
      assert.ok(variant.buildTasks.length >= 2)
      assert.ok(variant.describeTask.suggestedItemIds.length > 0)
      assert.ok(variant.speakingTask.speakingSeconds > 0)
    }
  }
})

test('loads the complete Personality Basic lesson with unique IDs and valid references', () => {
  const topic = topics.find((entry) => entry.id === 'personality')
  assert.ok(topic?.variants.basic)
  const variant = topic.variants.basic
  assert.equal(variant.vocabulary.length, 6)
  assert.equal(variant.exercises.length, 4)
  assert.equal(variant.buildTasks.length, 3)
  assert.equal(validateTopics([topic]).ok, true)
})

test('rejects a Personality reference and a changed closed-exercise solution', () => {
  const topic = structuredClone(topics[0])
  assert.ok(topic)
  const variant = topic.variants.basic
  assert.ok(variant)
  const build = variant.buildTasks[0]
  assert.ok(build)
  build.suggestedItemIds = ['missing-item']
  assert.equal(validateTopics([topic]).ok, false)
  const changed = structuredClone(topics[0])
  assert.ok(changed?.variants.basic)
  const choice = changed.variants.basic.exercises[1]
  assert.ok(choice?.type === 'choice')
  choice.correctOptionId = 'quiet'
  assert.equal(validateTopics([changed]).ok, true)
})

test('accepts a complete structural fixture with all closed exercise types', () => {
  assert.equal(validateTopics([makeTestTopic()]).ok, true)
})

test('rejects malformed unknown input without throwing', () => {
  for (const input of [null, undefined, 5, 'text', {}, [null], [{}], [{ variants: { basic: {} } }]]) {
    assert.equal(validateTopics(input).ok, false)
  }
})

test('requires non-empty fields and valid nested value types at runtime', () => {
  const topic = makeTestTopic()
  assert.equal(validateTopics([{ ...topic, title: '   ' }]).ok, false)
  assert.equal(validateTopics([{ ...topic, variants: { basic: { ...topic.variants.basic, vocabulary: 'invalid' } } }]).ok, false)
})

test('rejects duplicate topic IDs and slugs', () => {
  const result = validateTopics([makeTestTopic(), makeTestTopic()])
  assert.ok(result.issues.some((issue) => issue.path.startsWith('topics.id')))
  assert.ok(result.issues.some((issue) => issue.path.startsWith('topics.slug')))
})

test('requires URL-safe IDs, known levels and a subcategory belonging to the category', () => {
  const topic = makeTestTopic()
  for (const changed of [
    { ...topic, id: '../unsafe' }, { ...topic, category: 'unknown' },
    { ...topic, subcategory: 'city' }, { ...topic, variants: {} },
    { ...topic, variants: { advanced: topic.variants.basic } },
  ]) assert.equal(validateTopics([changed]).ok, false)
})

test('IDs may repeat across levels but not within the same level', () => {
  const topic = makeTestTopic()
  const basic = topic.variants.basic
  assert.ok(basic)
  topic.variants.standard = structuredClone(basic)
  assert.equal(validateTopics([topic]).ok, true)
  rejectsVariant((variant) => { const phrase = variant.phrases[0]; assert.ok(phrase); phrase.id = 'word-a' }, 'learningItems.id')
})

test('rejects incorrect bank kinds and malformed optional learning-item fields', () => {
  rejectsVariant((variant) => { const word = variant.vocabulary[0]; assert.ok(word); word.kind = 'phrase' }, '.kind')
  rejectsVariant((variant) => { const word = variant.vocabulary[0]; assert.ok(word); word.wordFinderPath = [] }, 'wordFinderPath')
})

test('validates references in Build, Describe and Speak', () => {
  rejectsVariant((variant) => { const build = variant.buildTasks[0]; assert.ok(build); build.suggestedItemIds = ['missing'] }, 'buildTasks[0].suggestedItemIds')
  rejectsVariant((variant) => { variant.describeTask.suggestedItemIds = ['missing'] }, 'describeTask.suggestedItemIds')
  rejectsVariant((variant) => { variant.speakingTask.suggestedItemIds = ['missing'] }, 'speakingTask.suggestedItemIds')
})

test('vocabulary references cannot point to a phrase or another level', () => {
  rejectsVariant((variant) => { const exercise = variant.exercises[0]; assert.ok(exercise); exercise.vocabularyItemIds = ['phrase-a'] }, 'vocabularyItemIds')
})

test('choice answers must reference a real option and labels must be distinguishable', () => {
  rejectsVariant((variant) => { const exercise = variant.exercises[0]; assert.ok(exercise?.type === 'choice'); exercise.correctOptionId = 'missing' }, 'correctOptionId')
  rejectsVariant((variant) => { const exercise = variant.exercises[0]; assert.ok(exercise?.type === 'choice'); exercise.options = [{ id: 'one', text: 'same' }, { id: 'two', text: 'same' }]; exercise.correctOptionId = 'one' }, 'options.text')
})

test('gaps require one marker and at least one non-empty answer', () => {
  rejectsVariant((variant) => { const exercise = variant.exercises[1]; assert.ok(exercise?.type === 'gap'); exercise.acceptedAnswers = [] }, 'acceptedAnswers')
  rejectsVariant((variant) => { const exercise = variant.exercises[1]; assert.ok(exercise?.type === 'gap'); exercise.sentence = '___ is ___.' }, '.sentence')
})

test('matching pairs cannot contain duplicate meanings', () => {
  rejectsVariant((variant) => { const exercise = variant.exercises[2]; assert.ok(exercise?.type === 'match'); exercise.pairs = [{ id: 'one', expression: 'A', meaning: 'Same' }, { id: 'two', expression: 'B', meaning: 'Same' }] }, 'pairs.meaning')
})

test('ordered solutions use every token exactly once and allow alternative permutations', () => {
  for (const order of [['token-a'], ['token-a', 'token-a'], ['token-a', 'missing']]) {
    rejectsVariant((variant) => { const exercise = variant.exercises[3]; assert.ok(exercise?.type === 'order'); exercise.acceptedOrders = [order] }, 'acceptedOrders')
  }
  const topic = makeTestTopic()
  const exercise = topic.variants.basic?.exercises[3]
  assert.ok(exercise?.type === 'order')
  exercise.acceptedOrders.push(['token-b', 'token-a'])
  assert.equal(validateTopics([topic]).ok, true)
})

test('activity IDs must be unique across exercises and Build', () => {
  rejectsVariant((variant) => { const build = variant.buildTasks[0]; assert.ok(build); build.id = 'choice-a' }, 'activities.id')
})

test('speaking durations are finite integers; preparation may be zero', () => {
  for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    rejectsVariant((variant) => { variant.speakingTask.preparationSeconds = value }, 'preparationSeconds')
  }
  rejectsVariant((variant) => { variant.speakingTask.speakingSeconds = 0 }, 'speakingSeconds')
})

test('optional images require alt text and a local non-traversing path', () => {
  const topic = makeTestTopic()
  for (const src of ['https://example.com/image.jpg', '/images/../secret', 'javascript:alert(1)']) {
    assert.equal(validateTopics([{ ...topic, image: { src, alt: 'Example.' } }]).ok, false)
  }
  assert.equal(validateTopics([{ ...topic, image: { src: '/images/example.svg', alt: '' } }]).ok, false)
})
