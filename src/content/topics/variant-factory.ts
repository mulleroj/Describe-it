import type { BuildTask, DescribeTask, Exercise, LearningItem, SpeakingTask, TopicVariant } from '../../domain/content-types.ts'

interface ChoiceSeed { prompt: string; options: { id: string; text: string }[]; correctOptionId: string; explanationEn: string; hintCs?: string }
interface GapSeed { sentence: string; acceptedAnswers: string[]; explanationEn: string; hintCs?: string }
interface OrderSeed { tokens: { id: string; text: string }[]; acceptedOrders: string[][]; explanationEn: string; hintCs?: string }

interface VariantSeed {
  learningGoal: string
  vocabulary: readonly LearningItem[]
  phrases?: readonly LearningItem[]
  collocations?: readonly LearningItem[]
  sentenceStarters?: readonly LearningItem[]
  exampleSentences: string[]
  modelDescription: string
  buildTasks: BuildTask[]
  buildChecklist: string[]
  describeTask: DescribeTask
  speakingTask: SpeakingTask
  choice: ChoiceSeed
  gap: GapSeed
  order: OrderSeed
}

export function makeVariant(seed: VariantSeed): TopicVariant {
  const vocabulary = [...seed.vocabulary]
  return {
    learningGoal: seed.learningGoal,
    vocabulary,
    phrases: [...(seed.phrases ?? [])],
    collocations: [...(seed.collocations ?? [])],
    sentenceStarters: [...(seed.sentenceStarters ?? [])],
    exampleSentences: seed.exampleSentences,
    modelDescription: seed.modelDescription,
    exercises: [
      { id: 'meaning-match', type: 'match', instructionEn: 'Match each English word with its Czech meaning.', explanationEn: 'These expressions help you describe the topic.', vocabularyItemIds: vocabulary.map((item) => item.id), pairs: vocabulary.map((item) => ({ id: `${item.id}-meaning`, expression: item.english, meaning: item.meaningCs })) },
      { id: 'choose-word', type: 'choice', instructionEn: 'Choose the best word.', explanationEn: seed.choice.explanationEn, vocabularyItemIds: vocabulary.map((item) => item.id), prompt: seed.choice.prompt, options: seed.choice.options, correctOptionId: seed.choice.correctOptionId, ...(seed.choice.hintCs ? { hintCs: seed.choice.hintCs } : {}) },
      { id: 'complete-sentence', type: 'gap', instructionEn: 'Complete the sentence.', explanationEn: seed.gap.explanationEn, vocabularyItemIds: vocabulary.map((item) => item.id), sentence: seed.gap.sentence, acceptedAnswers: seed.gap.acceptedAnswers, ...(seed.gap.hintCs ? { hintCs: seed.gap.hintCs } : {}) },
      { id: 'sentence-order', type: 'order', instructionEn: 'Put the words in the right order.', explanationEn: seed.order.explanationEn, vocabularyItemIds: vocabulary.map((item) => item.id), tokens: seed.order.tokens, acceptedOrders: seed.order.acceptedOrders, ...(seed.order.hintCs ? { hintCs: seed.order.hintCs } : {}) },
    ] satisfies Exercise[],
    buildTasks: seed.buildTasks,
    buildChecklist: seed.buildChecklist,
    describeTask: seed.describeTask,
    speakingTask: seed.speakingTask,
  }
}
