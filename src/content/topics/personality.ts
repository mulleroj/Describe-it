import type { Topic } from '../../domain/content-types.ts'

const vocabulary = [
  { id: 'kind', kind: 'word', english: 'kind', explanationEn: 'Caring about other people and wanting to help.', meaningCs: 'laskavý / hodný', exampleEn: 'My sister is very kind.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
  { id: 'friendly', kind: 'word', english: 'friendly', explanationEn: 'Nice and easy to talk to.', meaningCs: 'přátelský', exampleEn: 'Our new neighbour is friendly.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
  { id: 'helpful', kind: 'word', english: 'helpful', explanationEn: 'Willing to help other people.', meaningCs: 'ochotný / nápomocný', exampleEn: 'My brother is very helpful.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
  { id: 'honest', kind: 'word', english: 'honest', explanationEn: 'Always telling the truth.', meaningCs: 'čestný / upřímný', exampleEn: 'I trust Anna because she is honest.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
  { id: 'funny', kind: 'word', english: 'funny', explanationEn: 'Making people laugh.', meaningCs: 'vtipný', exampleEn: 'He tells funny stories.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
  { id: 'quiet', kind: 'word', english: 'quiet', explanationEn: 'Not talking very much or making much noise.', meaningCs: 'tichý / klidný', exampleEn: 'Tom is quiet in a big group.', partOfSpeech: 'adjective', wordFinderPath: ['people', 'personality'] },
] as const

const sentenceStarters = [
  { id: 'starter-my-person', kind: 'sentence-starter', english: 'My friend is ___', explanationEn: 'Start with a person you know.', meaningCs: 'Můj kamarád / kamarádka je ___', exampleEn: 'My friend is friendly.', usageNoteCs: 'Doplň přídavné jméno.' },
  { id: 'starter-my-person-very', kind: 'sentence-starter', english: 'My ___ is very ___', explanationEn: 'Add a person and one strong quality.', meaningCs: 'Můj / moje ___ je velmi ___', exampleEn: 'My brother is very helpful.', usageNoteCs: 'Doplň osobu a vlastnost.' },
  { id: 'starter-think-because', kind: 'sentence-starter', english: 'I think ___ is ___ because ___', explanationEn: 'Give an opinion and a simple reason.', meaningCs: 'Myslím, že ___ je ___, protože ___', exampleEn: 'I think Mia is kind because she helps me.', usageNoteCs: 'Doplň osobu, vlastnost a důvod.' },
] as const

const phrases = [
  { id: 'brother', kind: 'phrase', english: 'brother', explanationEn: 'A male sibling.', meaningCs: 'bratr', exampleEn: 'My brother is helpful.' },
  { id: 'anna', kind: 'phrase', english: 'Anna', explanationEn: 'A person’s name.', meaningCs: 'Anna', exampleEn: 'Anna is friendly.' },
  { id: 'she-helps-me', kind: 'phrase', english: 'she helps me', explanationEn: 'A simple reason about a helpful person.', meaningCs: 'pomáhá mi', exampleEn: 'I like Anna because she helps me.' },
] as const

export const personality: Topic = {
  id: 'personality',
  slug: 'personality',
  title: 'Describing personality',
  category: 'people',
  subcategory: 'personality',
  shortDescription: 'Use simple adjectives to describe what a person is like.',
  variants: {
    basic: {
      learningGoal: 'I can describe a person with simple personality adjectives and short sentences.',
      vocabulary: [...vocabulary],
      phrases: [...phrases],
      collocations: [],
      sentenceStarters: [...sentenceStarters],
      exampleSentences: ['My friend is kind and friendly.', 'My brother is very helpful.', 'I think Tom is funny because he tells good stories.'],
      modelDescription: 'My good friend is Anna. She is kind and friendly. She is also helpful. She helps me with my homework. I like Anna because she is funny.',
      exercises: [
        { id: 'meaning-match', type: 'match', instructionEn: 'Match each English word with its Czech meaning.', explanationEn: 'These adjectives describe a person’s personality.', vocabularyItemIds: vocabulary.map((item) => item.id), pairs: vocabulary.map((item) => ({ id: `${item.id}-meaning`, expression: item.english, meaning: item.meaningCs })) },
        { id: 'choose-helpful', type: 'choice', instructionEn: 'Choose the best word.', explanationEn: 'Helpful means willing to help other people.', vocabularyItemIds: ['helpful', 'quiet', 'funny'], prompt: 'Tom always helps his classmates.', options: [{ id: 'helpful', text: 'helpful' }, { id: 'quiet', text: 'quiet' }, { id: 'funny', text: 'funny' }], correctOptionId: 'helpful' },
        { id: 'complete-honest', type: 'gap', instructionEn: 'Complete the sentence with a personality adjective.', explanationEn: 'Someone who always tells the truth is honest.', vocabularyItemIds: ['honest', 'kind', 'quiet'], sentence: 'My friend always tells the truth. She is ___.', acceptedAnswers: ['honest'] },
        { id: 'order-kind', type: 'order', instructionEn: 'Put the words in the right order.', explanationEn: 'In a simple sentence, put the person first, then is, then the adjective.', vocabularyItemIds: ['kind'], tokens: [{ id: 'my', text: 'My' }, { id: 'brother', text: 'brother' }, { id: 'is', text: 'is' }, { id: 'very', text: 'very' }, { id: 'kind', text: 'kind.' }], acceptedOrders: [['my', 'brother', 'is', 'very', 'kind']] },
      ],
      buildTasks: [
        { id: 'build-friend', template: 'My friend is ___.', suggestedItemIds: ['kind', 'friendly', 'funny', 'quiet'] },
        { id: 'build-person', template: 'My ___ is very ___.', suggestedItemIds: ['brother', 'kind', 'helpful', 'friendly'] },
        { id: 'build-reason', template: 'I think ___ is ___ because ___.', suggestedItemIds: ['anna', 'kind', 'she-helps-me'] },
      ],
      buildChecklist: ['I used a personality adjective.', 'I wrote a complete sentence.', 'I started with a capital letter.', 'I used a full stop.'],
      describeTask: {
        prompt: 'Describe a good friend.',
        situation: 'Think of a friend who makes you feel good. You can use Anna, a real friend, or an imaginary friend.',
        suggestedItemIds: ['kind', 'friendly', 'helpful', 'funny', 'starter-my-person', 'starter-my-person-very'],
        checklist: ['I used at least 3 personality words.', 'I wrote complete sentences.', 'I started each sentence with a capital letter.', 'I used full stops.'],
      },
      speakingTask: { prompt: 'Describe a person you like.', preparationSeconds: 30, speakingSeconds: 45, suggestedItemIds: ['kind', 'friendly', 'helpful', 'funny', 'quiet'] },
    },
  },
}
