import { useMemo, useState } from 'react'
import type { Exercise, LearningItem, TopicVariant } from '../../domain/content-types.ts'
import { isPracticeAnswerCorrect, type PracticeAnswer } from './practice.ts'

interface Feedback { status: 'correct' | 'incorrect'; message: string }

function allItems(variant: TopicVariant) {
  return [...variant.vocabulary, ...variant.phrases, ...variant.collocations, ...variant.sentenceStarters] as LearningItem[]
}

export function PracticeStep({ variant }: { variant: TopicVariant }) {
  const [current, setCurrent] = useState(0)
  const exercise = variant.exercises[current]
  const items = useMemo(() => allItems(variant), [variant])

  if (!exercise) return null

  return (
    <section className="lesson-step" aria-labelledby="practice-title">
      <p className="eyebrow">Step 2 · Practice</p>
      <h2 id="practice-title" tabIndex={-1}>Try it four ways</h2>
      <p className="step-intro">Choose an activity. You can repeat any attempt; this lesson does not give a score.</p>
      <ol className="activity-nav" aria-label="Practice activities">
        {variant.exercises.map((entry, index) => <li key={entry.id}><button type="button" className={index === current ? 'is-current' : ''} aria-current={index === current ? 'step' : undefined} onClick={() => setCurrent(index)}>Activity {index + 1}<span>{entry.type === 'match' ? 'Meaning match' : entry.type === 'choice' ? 'Choose the word' : entry.type === 'gap' ? 'Complete the sentence' : 'Sentence order'}</span></button></li>)}
      </ol>
      <ActivityCard exercise={exercise} activityNumber={current + 1} total={variant.exercises.length} items={items} onNext={() => setCurrent((value) => Math.min(value + 1, variant.exercises.length - 1))} />
    </section>
  )
}

function ActivityCard({ exercise, activityNumber, total, items, onNext }: { exercise: Exercise; activityNumber: number; total: number; items: LearningItem[]; onNext: () => void }) {
  const [answer, setAnswer] = useState<PracticeAnswer>(exercise.type === 'match' ? {} : exercise.type === 'order' ? [] : '')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  function checkAnswer() {
    const correct = isPracticeAnswerCorrect(exercise, answer)
    setFeedback({ status: correct ? 'correct' : 'incorrect', message: correct ? `Correct. ${exercise.explanationEn}` : `Not yet. Try again. ${exercise.hintCs ?? 'Look at the words and try once more.'}` })
  }
  function retry() { setAnswer(exercise.type === 'match' ? {} : exercise.type === 'order' ? [] : ''); setFeedback(null) }
  return <article className="activity-card card" aria-labelledby={`activity-${exercise.id}`}><p className="activity-card__type">Activity {activityNumber} of {total}</p><h3 id={`activity-${exercise.id}`}>{exercise.instructionEn}</h3>{exercise.type === 'choice' && <ChoiceActivity exercise={exercise} answer={answer} setAnswer={setAnswer} />}{exercise.type === 'gap' && <GapActivity exercise={exercise} answer={answer} setAnswer={setAnswer} />}{exercise.type === 'match' && <MatchActivity exercise={exercise} answer={answer} setAnswer={setAnswer} />}{exercise.type === 'order' && <OrderActivity exercise={exercise} answer={answer} setAnswer={setAnswer} />}{exercise.vocabularyItemIds && <p className="activity-hint">Words in this activity: {exercise.vocabularyItemIds.map((id) => items.find((item) => item.id === id)?.english).filter(Boolean).join(' · ')}</p>}{feedback && <div className={`feedback feedback--${feedback.status}`} role="status" aria-live="polite"><strong>{feedback.status === 'correct' ? 'Correct answer' : 'Keep trying'}</strong><span>{feedback.message}</span></div>}<div className="activity-actions"><button className="button button--primary" type="button" onClick={checkAnswer}>{feedback?.status === 'correct' ? 'Check again' : 'Check answer'}</button>{feedback?.status === 'incorrect' && <button className="button button--secondary" type="button" onClick={retry}>Try again</button>}{feedback?.status === 'correct' && activityNumber < total && <button className="button button--secondary" type="button" onClick={onNext}>Next activity <span aria-hidden="true">→</span></button>}</div></article>
}

function ChoiceActivity({ exercise, answer, setAnswer }: { exercise: Extract<Exercise, { type: 'choice' }>; answer: PracticeAnswer; setAnswer: (answer: PracticeAnswer) => void }) {
  return <fieldset className="choice-list"><legend>{exercise.prompt}</legend>{exercise.options.map((option) => <label className="choice-option" key={option.id}><input type="radio" name={exercise.id} value={option.id} checked={answer === option.id} onChange={() => setAnswer(option.id)} /> <span>{option.text}</span></label>)}</fieldset>
}

function GapActivity({ exercise, answer, setAnswer }: { exercise: Extract<Exercise, { type: 'gap' }>; answer: PracticeAnswer; setAnswer: (answer: PracticeAnswer) => void }) {
  const parts = exercise.sentence.split('___')
  return <div className="gap-activity"><p className="sentence-line">{parts[0]}<label><span className="sr-only">Missing word</span><input type="text" value={typeof answer === 'string' ? answer : ''} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" /></label>{parts[1]}</p></div>
}

function MatchActivity({ exercise, answer, setAnswer }: { exercise: Extract<Exercise, { type: 'match' }>; answer: PracticeAnswer; setAnswer: (answer: PracticeAnswer) => void }) {
  const selections = typeof answer === 'object' && !Array.isArray(answer) ? answer : {}
  return <div className="match-list">{exercise.pairs.map((pair) => <label className="match-row" key={pair.id}><span>{pair.expression}</span><span aria-hidden="true">→</span><select aria-label={`Meaning for ${pair.expression}`} value={selections[pair.id] ?? ''} onChange={(event) => setAnswer({ ...selections, [pair.id]: event.target.value })}><option value="">Choose a meaning</option>{exercise.pairs.map((option) => <option value={option.id} key={option.id}>{option.meaning}</option>)}</select></label>)}</div>
}

function OrderActivity({ exercise, answer, setAnswer }: { exercise: Extract<Exercise, { type: 'order' }>; answer: PracticeAnswer; setAnswer: (answer: PracticeAnswer) => void }) {
  const selected = Array.isArray(answer) ? answer : []
  return <div className="order-activity"><p className="order-label">Build your sentence:</p><div className="token-tray" aria-live="polite">{selected.map((id) => <button type="button" className="token token--selected" key={id} onClick={() => setAnswer(selected.filter((token) => token !== id))}>{exercise.tokens.find((token) => token.id === id)?.text} <span aria-hidden="true">×</span></button>)}{selected.length === 0 && <span className="muted">Choose a word below.</span>}</div><div className="token-options" aria-label="Words to arrange">{exercise.tokens.filter((token) => !selected.includes(token.id)).map((token) => <button type="button" className="token" key={token.id} onClick={() => setAnswer([...selected, token.id])}>{token.text}</button>)}</div></div>
}
