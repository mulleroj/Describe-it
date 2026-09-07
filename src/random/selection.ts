import type { LevelId, LearningItem, Topic, TopicVariant } from '../domain/content-types.ts'

export interface RandomSelection { topic: Topic; level: LevelId; variant: TopicVariant }

const RANDOM_CATEGORIES = new Set(['people', 'situations'])

export function randomSelection(topics: readonly Topic[], level: LevelId, random = Math.random, previousKey?: string): RandomSelection | null {
  const candidates = topics.filter((topic) => RANDOM_CATEGORIES.has(topic.category) && topic.variants[level]).map((topic) => ({ topic, level, variant: topic.variants[level] as TopicVariant }))
  const eligible = candidates.length > 1 && previousKey ? candidates.filter((candidate) => `${candidate.topic.id}:${candidate.level}` !== previousKey) : candidates
  if (eligible.length === 0) return null
  const randomValue = random()
  const value = Number.isFinite(randomValue) ? randomValue : 0
  const index = Math.min(eligible.length - 1, Math.max(0, Math.floor(value * eligible.length)))
  return eligible[index] ?? null
}

export function challengeExpressions(variant: TopicVariant, count = 3): LearningItem[] {
  return [...variant.vocabulary, ...variant.phrases, ...variant.collocations].slice(0, count)
}

export function challengeKey(selection: RandomSelection) { return `${selection.topic.id}:${selection.level}` }
