import type { LearningItem, Topic } from '../../domain/content-types.ts'
import { makeVariant } from './variant-factory.ts'

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

const personalityStandardVocabulary = [
  { id: 'reliable', kind: 'word', english: 'reliable', explanationEn: 'Someone you can trust to do what they say.', meaningCs: 'spolehlivý', exampleEn: 'She is reliable because she always keeps her promises.', partOfSpeech: 'adjective' },
  { id: 'caring', kind: 'word', english: 'caring', explanationEn: 'Kind and interested in other people’s feelings.', meaningCs: 'starostlivý / pečující', exampleEn: 'He is caring and notices when people need help.', partOfSpeech: 'adjective' },
  { id: 'confident', kind: 'word', english: 'confident', explanationEn: 'Believing that you can do something well.', meaningCs: 'sebevědomý', exampleEn: 'Mia feels confident when she speaks English.', partOfSpeech: 'adjective' },
  { id: 'patient', kind: 'word', english: 'patient', explanationEn: 'Able to wait or help without becoming angry.', meaningCs: 'trpělivý', exampleEn: 'Our teacher is patient when we make mistakes.', partOfSpeech: 'adjective' },
  { id: 'respectful', kind: 'word', english: 'respectful', explanationEn: 'Showing that you value other people and their ideas.', meaningCs: 'uctivý / respektující', exampleEn: 'A respectful person listens to different opinions.', partOfSpeech: 'adjective' },
  { id: 'sociable', kind: 'word', english: 'sociable', explanationEn: 'Enjoying meeting and talking with people.', meaningCs: 'společenský', exampleEn: 'Lena is sociable and enjoys meeting new people.', partOfSpeech: 'adjective' },
] as const satisfies readonly LearningItem[]
const personalityStandardPhrases = [
  { id: 'depend-on-her', kind: 'phrase', english: 'you can depend on her', explanationEn: 'A reason why someone is reliable.', meaningCs: 'můžeš se na ni spolehnout', exampleEn: 'You can depend on her when you need help.' },
  { id: 'takes-time-to-listen', kind: 'phrase', english: 'takes time to listen', explanationEn: 'A caring person listens carefully.', meaningCs: 'udělá si čas na naslouchání', exampleEn: 'He takes time to listen to his friends.' },
] as const satisfies readonly LearningItem[]
const personalityStandardStarters = [
  { id: 'starter-because', kind: 'sentence-starter', english: 'I think ___ is ___ because ___', explanationEn: 'Give an opinion and a reason.', meaningCs: 'Myslím, že ___ je ___, protože ___', exampleEn: 'I think Leo is reliable because he keeps his promises.' },
  { id: 'starter-when', kind: 'sentence-starter', english: 'You can depend on ___ when ___', explanationEn: 'Explain when someone helps.', meaningCs: 'Můžeš se spolehnout na ___, když ___', exampleEn: 'You can depend on Mia when you have a problem.' },
] as const satisfies readonly LearningItem[]

const personalityStandard = makeVariant({
  learningGoal: 'I can describe a person with more precise adjectives and explain my ideas with because.',
  vocabulary: personalityStandardVocabulary,
  phrases: personalityStandardPhrases,
  sentenceStarters: personalityStandardStarters,
  exampleSentences: ['She is reliable because you can always depend on her.', 'He is caring, so he takes time to listen.', 'Lena is sociable and enjoys meeting new people.'],
  modelDescription: 'My colleague Mia is reliable and caring. You can depend on her when you have a problem because she always listens. She is also confident and sociable, so she enjoys helping new people feel welcome.',
  buildTasks: [
    { id: 'build-because', template: 'I think my friend is ___ because ___.', suggestedItemIds: ['reliable', 'caring', 'depend-on-her', 'takes-time-to-listen'] },
    { id: 'build-depend', template: 'You can depend on ___ when ___.', suggestedItemIds: ['reliable', 'depend-on-her', 'caring'] },
  ],
  buildChecklist: ['I used a precise personality adjective.', 'I connected my ideas with because, so, or and.', 'I gave a reason or example.', 'I checked my punctuation.'],
  describeTask: { prompt: 'Describe someone people can trust.', situation: 'Choose a friend, family member, classmate, or colleague. Explain what makes this person reliable or caring.', suggestedItemIds: ['reliable', 'caring', 'patient', 'respectful', 'starter-because', 'starter-when'], checklist: ['I used at least 3 personality words.', 'I explained at least one idea with a reason.', 'I used complete sentences.', 'I checked my punctuation.'] },
  speakingTask: { prompt: 'Describe a person who is good to work with.', preparationSeconds: 30, speakingSeconds: 60, suggestedItemIds: ['reliable', 'caring', 'confident', 'patient', 'sociable'] },
  choice: { prompt: 'You can always trust Ben to arrive on time and do his job.', options: [{ id: 'reliable', text: 'reliable' }, { id: 'sociable', text: 'sociable' }, { id: 'confident', text: 'confident' }], correctOptionId: 'reliable', explanationEn: 'Reliable means that you can trust someone to do what they say.' },
  gap: { sentence: 'Our classmate listens carefully and never laughs at mistakes. She is ___.', acceptedAnswers: ['respectful'], explanationEn: 'Respectful people value other people and their ideas.' },
  order: { tokens: [{ id: 'you', text: 'You' }, { id: 'can', text: 'can' }, { id: 'depend', text: 'depend' }, { id: 'on', text: 'on' }, { id: 'her', text: 'her.' }], acceptedOrders: [['you', 'can', 'depend', 'on', 'her']], explanationEn: 'Use can depend on someone to say that you trust them.' },
})

const personalityChallengeVocabulary = [
  { id: 'self-assured', kind: 'word', english: 'self-assured', explanationEn: 'Calmly confident in your own abilities.', meaningCs: 'sebejistý', exampleEn: 'She sounds self-assured when she presents her ideas.', partOfSpeech: 'adjective' },
  { id: 'considerate', kind: 'word', english: 'considerate', explanationEn: 'Careful not to upset or inconvenience other people.', meaningCs: 'ohleduplný', exampleEn: 'He is considerate and checks that everyone is comfortable.', partOfSpeech: 'adjective' },
  { id: 'open-minded', kind: 'word', english: 'open-minded', explanationEn: 'Willing to listen to new or different ideas.', meaningCs: 'otevřený novým názorům', exampleEn: 'An open-minded person can change their opinion.', partOfSpeech: 'adjective' },
  { id: 'reserved', kind: 'word', english: 'reserved', explanationEn: 'Quiet and not quick to show your feelings.', meaningCs: 'zdrženlivý / rezervovaný', exampleEn: 'He can seem reserved when he first meets people.', partOfSpeech: 'adjective' },
  { id: 'dependable', kind: 'word', english: 'dependable', explanationEn: 'Reliable and deserving of trust over time.', meaningCs: 'spolehlivý', exampleEn: 'She is a dependable teammate in difficult situations.', partOfSpeech: 'adjective' },
  { id: 'easy-going', kind: 'word', english: 'easy-going', explanationEn: 'Relaxed and not easily worried or annoyed.', meaningCs: 'pohodový / bezstarostný', exampleEn: 'Our coach is easy-going but still expects us to work hard.', partOfSpeech: 'adjective' },
] as const satisfies readonly LearningItem[]
const personalityChallengePhrases = [
  { id: 'comes-across-as', kind: 'phrase', english: 'comes across as', explanationEn: 'The impression someone gives other people.', meaningCs: 'působí jako', exampleEn: 'He comes across as considerate.' },
  { id: 'first-impression', kind: 'phrase', english: 'my first impression is that', explanationEn: 'A careful way to describe an early opinion.', meaningCs: 'můj první dojem je, že', exampleEn: 'My first impression is that she is open-minded.' },
  { id: 'can-also-be', kind: 'phrase', english: 'can also be', explanationEn: 'Use this to add a different side of someone.', meaningCs: 'může být také', exampleEn: 'Although he is reserved, he can also be very funny.' },
] as const satisfies readonly LearningItem[]
const personalityChallengeStarters = [
  { id: 'starter-comes', kind: 'sentence-starter', english: 'He / She comes across as ___ because ___', explanationEn: 'Describe an impression and support it.', meaningCs: 'Působí jako ___, protože ___', exampleEn: 'She comes across as considerate because she notices small details.' },
  { id: 'starter-although', kind: 'sentence-starter', english: 'Although ___, he / she can also ___', explanationEn: 'Show two sides of a person.', meaningCs: 'Ačkoli ___, on / ona může být také ___', exampleEn: 'Although he is reserved, he can also be very funny.' },
] as const satisfies readonly LearningItem[]

const personalityChallenge = makeVariant({
  learningGoal: 'I can describe a person with nuance, show contrast, and make it clear when I am giving an impression rather than a fact.',
  vocabulary: personalityChallengeVocabulary,
  phrases: personalityChallengePhrases,
  sentenceStarters: personalityChallengeStarters,
  exampleSentences: ['He comes across as self-assured, although he can be reserved at first.', 'She seems considerate because she notices when others need space.', 'My first impression is that he is easy-going, but he is also dependable.'],
  modelDescription: 'My first impression of Alex was that he was reserved. However, he soon came across as considerate and open-minded. Although he does not speak much in a large group, he can also be very easy-going in a smaller conversation. I would describe him as dependable because he always follows through.',
  buildTasks: [
    { id: 'build-impression', template: 'My first impression is that ___ comes across as ___.', suggestedItemIds: ['first-impression', 'comes-across-as', 'self-assured', 'considerate'] },
    { id: 'build-contrast', template: 'Although ___, he / she can also ___.', suggestedItemIds: ['reserved', 'can-also-be', 'easy-going', 'dependable'] },
  ],
  buildChecklist: ['I used language for an impression or possibility.', 'I showed a contrast with although or however.', 'I supported my description with a reason.', 'I used precise punctuation and spelling.'],
  describeTask: { prompt: 'Describe a person with two sides.', situation: 'Choose someone who may seem one way at first but shows another side over time. Be careful to describe your impression, not an unproven fact.', suggestedItemIds: ['self-assured', 'considerate', 'open-minded', 'reserved', 'dependable', 'starter-comes', 'starter-although'], checklist: ['I used at least 4 precise personality words.', 'I included a contrast.', 'I marked an impression with seems or comes across as.', 'I supported my ideas with examples.'] },
  speakingTask: { prompt: 'Give a nuanced description of someone you know.', preparationSeconds: 25, speakingSeconds: 75, suggestedItemIds: ['self-assured', 'considerate', 'open-minded', 'reserved', 'dependable', 'easy-going'] },
  choice: { prompt: 'At first, Maya says very little. Later, she listens carefully and respects different opinions.', options: [{ id: 'reserved', text: 'reserved' }, { id: 'open-minded', text: 'open-minded' }, { id: 'easy-going', text: 'easy-going' }], correctOptionId: 'reserved', explanationEn: 'Reserved describes someone who is quiet and slow to show their feelings.' },
  gap: { sentence: 'He checks that nobody is uncomfortable before making a decision. He is ___.', acceptedAnswers: ['considerate'], explanationEn: 'Considerate people think about other people’s comfort and needs.' },
  order: { tokens: [{ id: 'although', text: 'Although' }, { id: 'she', text: 'she' }, { id: 'is', text: 'is' }, { id: 'reserved', text: 'reserved,' }, { id: 'she-can', text: 'she can' }, { id: 'also', text: 'also' }, { id: 'be', text: 'be' }, { id: 'funny', text: 'funny.' }], acceptedOrders: [['although', 'she', 'is', 'reserved', 'she-can', 'also', 'be', 'funny']], explanationEn: 'Although introduces a contrast between two true ideas.' },
})

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
    standard: personalityStandard,
    challenge: personalityChallenge,
  },
}
