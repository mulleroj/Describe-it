import type { Topic } from '../../src/domain/content-types.ts'

/** Structural test data only. Never imported by the application catalog. */
export function makeTestTopic(): Topic {
  return {
    id: 'test-topic', slug: 'test-topic', title: 'Validation fixture',
    category: 'people', subcategory: 'personality', shortDescription: 'Test data only.',
    variants: {
      basic: {
        learningGoal: 'Test the content contract.',
        vocabulary: [{ id: 'word-a', kind: 'word', english: 'kind', explanationEn: 'Helpful to others.', meaningCs: 'laskavý', exampleEn: 'He is kind.', partOfSpeech: 'adjective', wordFinderPath: ['person', 'personality'] }],
        phrases: [{ id: 'phrase-a', kind: 'phrase', english: 'a kind person', explanationEn: 'Someone who helps.', meaningCs: 'laskavý člověk', exampleEn: 'She is a kind person.' }],
        collocations: [], sentenceStarters: [], exampleSentences: ['He is kind.'], modelDescription: 'He is kind.',
        exercises: [
          { id: 'choice-a', type: 'choice', instructionEn: 'Choose.', explanationEn: 'Test explanation.', vocabularyItemIds: ['word-a'], prompt: 'Test prompt.', options: [{ id: 'option-a', text: 'First' }, { id: 'option-b', text: 'Second' }], correctOptionId: 'option-a' },
          { id: 'gap-a', type: 'gap', instructionEn: 'Complete.', explanationEn: 'Test explanation.', sentence: 'He is ___.', acceptedAnswers: ['kind'] },
          { id: 'match-a', type: 'match', instructionEn: 'Match.', explanationEn: 'Test explanation.', pairs: [{ id: 'pair-a', expression: 'First', meaning: 'One' }, { id: 'pair-b', expression: 'Second', meaning: 'Two' }] },
          { id: 'order-a', type: 'order', instructionEn: 'Order.', explanationEn: 'Test explanation.', tokens: [{ id: 'token-a', text: 'Hello' }, { id: 'token-b', text: 'there' }], acceptedOrders: [['token-a', 'token-b']] },
        ],
        buildTasks: [{ id: 'build-a', template: 'He is ___.', suggestedItemIds: ['word-a'] }],
        buildChecklist: ['Use a sentence.'],
        describeTask: { prompt: 'Describe.', situation: 'A test situation.', suggestedItemIds: ['phrase-a'], checklist: ['Use a sentence.'] },
        speakingTask: { prompt: 'Speak.', preparationSeconds: 30, speakingSeconds: 45, suggestedItemIds: ['word-a'] },
      },
    },
  }
}
