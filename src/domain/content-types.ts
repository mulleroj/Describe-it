export const LEVEL_IDS = ['basic', 'standard', 'challenge'] as const
export type LevelId = (typeof LEVEL_IDS)[number]
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2'

export const CATEGORY_IDS = ['people', 'places', 'things', 'situations', 'five-senses'] as const
export type CategoryId = (typeof CATEGORY_IDS)[number]

export interface Category {
  id: CategoryId
  title: string
  subcategories: readonly { id: string; title: string }[]
}

export interface LevelDefinition {
  id: LevelId
  title: string
  cefr: readonly [CefrLevel, CefrLevel]
  description: string
}

export interface LearningItem {
  id: string
  kind: 'word' | 'phrase' | 'collocation' | 'sentence-starter'
  english: string
  explanationEn: string
  meaningCs: string
  exampleEn: string
  partOfSpeech?: 'adjective' | 'noun' | 'verb' | 'adverb'
  wordFinderPath?: readonly string[]
  usageNoteCs?: string
}

interface ExerciseBase {
  id: string
  instructionEn: string
  hintCs?: string
  explanationEn: string
  /** References specifically into this variant's vocabulary bank. */
  vocabularyItemIds?: string[]
}

export type Exercise = ExerciseBase & (
  | { type: 'choice'; prompt: string; options: { id: string; text: string }[]; correctOptionId: string }
  | { type: 'gap'; sentence: string; acceptedAnswers: string[] }
  | { type: 'match'; pairs: { id: string; expression: string; meaning: string }[] }
  | { type: 'order'; tokens: { id: string; text: string }[]; acceptedOrders: string[][] }
)

export interface BuildTask {
  id: string
  /** Use exactly three underscores for each editable slot. */
  template: string
  suggestedItemIds: string[]
}

export interface DescribeTask {
  prompt: string
  situation: string
  suggestedItemIds: string[]
  checklist: string[]
}

export interface SpeakingTask {
  prompt: string
  preparationSeconds: number
  speakingSeconds: number
  suggestedItemIds: string[]
}

export interface TopicVariant {
  learningGoal: string
  vocabulary: LearningItem[]
  phrases: LearningItem[]
  collocations: LearningItem[]
  sentenceStarters: LearningItem[]
  exampleSentences: string[]
  modelDescription: string
  exercises: Exercise[]
  buildTasks: BuildTask[]
  buildChecklist: string[]
  describeTask: DescribeTask
  speakingTask: SpeakingTask
}

export interface Topic {
  id: string
  slug: string
  title: string
  category: CategoryId
  subcategory: string
  shortDescription: string
  image?: { src: string; alt: string; credit?: string; license?: string }
  /** CEFR ranges are defined centrally in content/levels.ts. */
  variants: Partial<Record<LevelId, TopicVariant>>
}

/** Data contract only. Random selection and timers are outside Stage 1. */
export interface RandomChallenge {
  topicId: string
  level: LevelId
  prompt: string
  requiredItemIds: string[]
  preparationSeconds: number
  speakingSeconds: number
}
