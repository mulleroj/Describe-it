import { categories } from '../content/categories.ts'
import { CATEGORY_IDS, LEVEL_IDS, type Topic } from '../domain/content-types.ts'

export interface ValidationIssue { path: string; message: string }
export type ValidationResult<T> =
  | { ok: true; data: T; issues: [] }
  | { ok: false; issues: ValidationIssue[] }

// All entry points accept unknown, including data loaded outside TypeScript.
class ContentCheck {
  issues: ValidationIssue[] = []

  issue(path: string, message: string) { this.issues.push({ path, message }) }

  object(value: unknown, path: string): Record<string, unknown> {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as Record<string, unknown>
    }
    this.issue(path, 'Expected an object.')
    return {}
  }

  list(value: unknown, path: string, minimum = 0): unknown[] {
    if (!Array.isArray(value)) {
      this.issue(path, 'Expected an array.')
      return []
    }
    if (value.length < minimum) this.issue(path, `Expected at least ${minimum} item(s).`)
    return value as unknown[]
  }

  text(value: unknown, path: string): string {
    if (typeof value === 'string' && value.trim().length > 0) return value
    this.issue(path, 'Expected a non-empty string.')
    return ''
  }

  fields(object: Record<string, unknown>, path: string, fields: string[]) {
    for (const key of fields) this.text(object[key], `${path}.${key}`)
  }

  optionalText(object: Record<string, unknown>, path: string, keys: string[]) {
    for (const key of keys) if (key in object) this.text(object[key], `${path}.${key}`)
  }

  enum(value: unknown, path: string, allowed: readonly string[]): string {
    const result = this.text(value, path)
    if (!allowed.includes(result)) this.issue(path, `Expected one of: ${allowed.join(', ')}.`)
    return result
  }

  strings(value: unknown, path: string, minimum = 0): string[] {
    return this.list(value, path, minimum).map((entry, i) => this.text(entry, `${path}[${i}]`))
  }

  unique(values: string[], path: string) {
    const seen = new Set<string>()
    values.forEach((value, i) => {
      if (seen.has(value)) this.issue(`${path}[${i}]`, `Duplicate value: ${value}.`)
      seen.add(value)
    })
  }

  id(value: unknown, path: string): string {
    const id = this.text(value, path)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      this.issue(path, 'Use a lowercase URL-safe identifier with hyphens.')
    }
    return id
  }

  refs(value: unknown, path: string, available: Set<string>) {
    const ids = this.strings(value, path)
    this.unique(ids, path)
    ids.forEach((id, i) => {
      if (!available.has(id)) this.issue(`${path}[${i}]`, `Unknown item reference: ${id}.`)
    })
  }

  seconds(value: unknown, path: string, minimum: number) {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
      this.issue(path, `Expected an integer of at least ${minimum} seconds.`)
    }
  }
}

function checkExercise(check: ContentCheck, value: unknown, path: string, vocabulary: Set<string>): string {
  const exercise = check.object(value, path)
  const id = check.id(exercise.id, `${path}.id`)
  check.fields(exercise, path, ['instructionEn', 'explanationEn'])
  check.optionalText(exercise, path, ['hintCs'])
  if ('vocabularyItemIds' in exercise) {
    check.refs(exercise.vocabularyItemIds, `${path}.vocabularyItemIds`, vocabulary)
  }
  const type = check.enum(exercise.type, `${path}.type`, ['choice', 'gap', 'match', 'order'])
  if (type === 'choice') {
    check.text(exercise.prompt, `${path}.prompt`)
    const options = check.list(exercise.options, `${path}.options`, 2)
    const labels: string[] = []
    const ids = options.map((value, i) => {
      const option = check.object(value, `${path}.options[${i}]`)
      labels.push(check.text(option.text, `${path}.options[${i}].text`).trim().toLowerCase())
      return check.id(option.id, `${path}.options[${i}].id`)
    })
    check.unique(ids, `${path}.options.id`)
    check.unique(labels, `${path}.options.text`)
    const answer = check.text(exercise.correctOptionId, `${path}.correctOptionId`)
    if (!ids.includes(answer)) check.issue(`${path}.correctOptionId`, 'Answer must reference an existing option.')
  }
  if (type === 'gap') {
    const sentence = check.text(exercise.sentence, `${path}.sentence`)
    if (sentence.split('___').length !== 2 || sentence.includes('____')) {
      check.issue(`${path}.sentence`, 'A single-gap exercise must contain exactly one ___ marker.')
    }
    const answers = check.strings(exercise.acceptedAnswers, `${path}.acceptedAnswers`, 1)
    check.unique(answers.map((answer) => answer.trim().toLowerCase()), `${path}.acceptedAnswers`)
  }
  if (type === 'match') {
    const expressions: string[] = []
    const meanings: string[] = []
    const ids = check.list(exercise.pairs, `${path}.pairs`, 2).map((value, i) => {
      const pairPath = `${path}.pairs[${i}]`
      const pair = check.object(value, pairPath)
      expressions.push(check.text(pair.expression, `${pairPath}.expression`).trim().toLowerCase())
      meanings.push(check.text(pair.meaning, `${pairPath}.meaning`).trim().toLowerCase())
      return check.id(pair.id, `${pairPath}.id`)
    })
    check.unique(ids, `${path}.pairs.id`)
    check.unique(expressions, `${path}.pairs.expression`)
    check.unique(meanings, `${path}.pairs.meaning`)
  }
  if (type === 'order') {
    const ids = check.list(exercise.tokens, `${path}.tokens`, 2).map((value, i) => {
      const tokenPath = `${path}.tokens[${i}]`
      const token = check.object(value, tokenPath)
      check.text(token.text, `${tokenPath}.text`)
      return check.id(token.id, `${tokenPath}.id`)
    })
    check.unique(ids, `${path}.tokens.id`)
    check.list(exercise.acceptedOrders, `${path}.acceptedOrders`, 1).forEach((value, i) => {
      const answerPath = `${path}.acceptedOrders[${i}]`
      const answer = check.strings(value, answerPath, 2)
      check.unique(answer, answerPath)
      if (answer.length !== ids.length || answer.some((token) => !ids.includes(token))) {
        check.issue(answerPath, 'Every answer must contain each existing token ID exactly once.')
      }
    })
  }
  return id
}

function checkVariant(check: ContentCheck, value: unknown, path: string) {
  const variant = check.object(value, path)
  check.fields(variant, path, ['learningGoal', 'modelDescription'])
  const itemIds: string[] = []
  const vocabulary = new Set<string>()
  const banks = { vocabulary: 'word', phrases: 'phrase', collocations: 'collocation', sentenceStarters: 'sentence-starter' }
  for (const [bank, kind] of Object.entries(banks)) {
    check.list(variant[bank], `${path}.${bank}`, bank === 'vocabulary' ? 1 : 0).forEach((value, i) => {
      const itemPath = `${path}.${bank}[${i}]`
      const item = check.object(value, itemPath)
      const id = check.id(item.id, `${itemPath}.id`)
      itemIds.push(id)
      if (bank === 'vocabulary') vocabulary.add(id)
      check.enum(item.kind, `${itemPath}.kind`, [kind])
      check.fields(item, itemPath, ['english', 'explanationEn', 'meaningCs', 'exampleEn'])
      check.optionalText(item, itemPath, ['usageNoteCs'])
      if ('partOfSpeech' in item) check.enum(item.partOfSpeech, `${itemPath}.partOfSpeech`, ['adjective', 'noun', 'verb', 'adverb'])
      if ('wordFinderPath' in item) check.strings(item.wordFinderPath, `${itemPath}.wordFinderPath`, 1)
    })
  }
  check.unique(itemIds, `${path}.learningItems.id`)
  const available = new Set(itemIds)
  check.strings(variant.exampleSentences, `${path}.exampleSentences`, 1)
  const activityIds = check.list(variant.exercises, `${path}.exercises`).map((value, i) =>
    checkExercise(check, value, `${path}.exercises[${i}]`, vocabulary),
  )
  check.list(variant.buildTasks, `${path}.buildTasks`).forEach((value, i) => {
    const taskPath = `${path}.buildTasks[${i}]`
    const task = check.object(value, taskPath)
    activityIds.push(check.id(task.id, `${taskPath}.id`))
    const template = check.text(task.template, `${taskPath}.template`)
    if (!template.includes('___') || template.includes('____')) check.issue(`${taskPath}.template`, 'Use ___ for an editable slot.')
    check.refs(task.suggestedItemIds, `${taskPath}.suggestedItemIds`, available)
  })
  check.unique(activityIds, `${path}.activities.id`)

  check.strings(variant.buildChecklist, `${path}.buildChecklist`, 1)

  const describePath = `${path}.describeTask`
  const describe = check.object(variant.describeTask, describePath)
  check.fields(describe, describePath, ['prompt', 'situation'])
  check.strings(describe.checklist, `${describePath}.checklist`, 1)
  check.refs(describe.suggestedItemIds, `${describePath}.suggestedItemIds`, available)

  const speakPath = `${path}.speakingTask`
  const speak = check.object(variant.speakingTask, speakPath)
  check.text(speak.prompt, `${speakPath}.prompt`)
  check.seconds(speak.preparationSeconds, `${speakPath}.preparationSeconds`, 0)
  check.seconds(speak.speakingSeconds, `${speakPath}.speakingSeconds`, 1)
  check.refs(speak.suggestedItemIds, `${speakPath}.suggestedItemIds`, available)
}

export function validateTopics(input: unknown): ValidationResult<Topic[]> {
  const check = new ContentCheck()
  const entries = check.list(input, 'topics')
  const slugs: string[] = []
  const ids = entries.map((value, i) => {
    const path = `topics[${i}]`
    const topic = check.object(value, path)
    const id = check.id(topic.id, `${path}.id`)
    slugs.push(check.id(topic.slug, `${path}.slug`))
    check.fields(topic, path, ['title', 'shortDescription'])
    const categoryId = check.enum(topic.category, `${path}.category`, CATEGORY_IDS)
    const category = categories.find((entry) => entry.id === categoryId)
    const subcategory = check.text(topic.subcategory, `${path}.subcategory`)
    if (!category?.subcategories.some((entry) => entry.id === subcategory)) {
      check.issue(`${path}.subcategory`, 'Subcategory must belong to the selected category.')
    }
    if ('image' in topic) {
      const image = check.object(topic.image, `${path}.image`)
      const src = check.text(image.src, `${path}.image.src`)
      if (!/^\/images\/[a-zA-Z0-9_./-]+$/.test(src) || src.includes('..')) {
        check.issue(`${path}.image.src`, 'Use a local /images/ asset path without parent traversal.')
      }
      check.text(image.alt, `${path}.image.alt`)
      check.optionalText(image, `${path}.image`, ['credit', 'license'])
    }
    const variants = check.object(topic.variants, `${path}.variants`)
    if (Object.keys(variants).length === 0) check.issue(`${path}.variants`, 'A published topic needs at least one level.')
    for (const [level, variant] of Object.entries(variants)) {
      check.enum(level, `${path}.variants.${level}`, LEVEL_IDS)
      checkVariant(check, variant, `${path}.variants.${level}`)
    }
    return id
  })
  check.unique(ids, 'topics.id')
  check.unique(slugs, 'topics.slug')
  // The cast is confined to the successful runtime validation boundary.
  return check.issues.length === 0
    ? { ok: true, data: entries as Topic[], issues: [] }
    : { ok: false, issues: check.issues }
}
