import assert from 'node:assert/strict'
import test from 'node:test'
import { personality } from '../src/content/topics/personality.ts'
import { isPracticeAnswerCorrect } from '../src/components/lesson/practice.ts'

const variant = personality.variants.basic
if (!variant) throw new Error('Personality Basic fixture is missing.')

test('practice engine accepts and rejects all four activity answer shapes', () => {
  const [match, choice, gap, order] = variant.exercises
  assert.ok(match?.type === 'match')
  assert.ok(choice?.type === 'choice')
  assert.ok(gap?.type === 'gap')
  assert.ok(order?.type === 'order')
  assert.equal(isPracticeAnswerCorrect(choice, 'helpful'), true)
  assert.equal(isPracticeAnswerCorrect(choice, 'quiet'), false)
  assert.equal(isPracticeAnswerCorrect(gap, ' HONEST. '), true)
  assert.equal(isPracticeAnswerCorrect(gap, 'kind'), false)
  assert.equal(isPracticeAnswerCorrect(order, ['my', 'brother', 'is', 'very', 'kind']), true)
  assert.equal(isPracticeAnswerCorrect(order, ['brother', 'my', 'is', 'very', 'kind']), false)
  assert.equal(isPracticeAnswerCorrect(match, Object.fromEntries(match.pairs.map((pair) => [pair.id, pair.id]))), true)
  assert.equal(isPracticeAnswerCorrect(match, {}), false)
})
