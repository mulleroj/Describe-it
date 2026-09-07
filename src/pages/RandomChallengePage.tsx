import { useEffect, useMemo, useState } from 'react'
import { LevelSelector } from '../components/learning/LevelSelector.tsx'
import { SpeakingTimer } from '../components/lesson/SpeakingStep.tsx'
import { catalog } from '../content/catalog.ts'
import { levels } from '../content/levels.ts'
import { useLevel } from '../app/level-context.ts'
import { challengeExpressions, challengeKey, randomSelection, type RandomSelection } from '../random/selection.ts'
import { readLastRandomKey, saveLastRandomKey } from '../random/storage.ts'

export function RandomChallengePage() {
  const { level } = useLevel()
  const [nonce, setNonce] = useState(0)
  const [previousKey, setPreviousKey] = useState<string | undefined>(() => readLastRandomKey() ?? undefined)
  const selection = useMemo(() => { void nonce; return randomSelection(catalog.ok ? catalog.data : [], level, Math.random, previousKey) }, [level, nonce, previousKey])
  useEffect(() => { if (selection) saveLastRandomKey(challengeKey(selection)) }, [selection])
  const levelDefinition = levels.find((entry) => entry.id === level)

  function chooseAnother() { if (selection) setPreviousKey(challengeKey(selection)); setNonce((value) => value + 1) }
  function focusLevelChoice() { document.querySelector<HTMLInputElement>('input[name="level"]')?.focus() }

  return <section className="random-page" aria-labelledby="random-title"><div className="random-header"><p className="eyebrow">Random description challenge</p><h1 id="random-title">A little surprise.</h1><p className="step-intro">Use an existing lesson challenge. Nothing is generated and no new text is added at runtime.</p></div><div className="random-level-choice"><LevelSelector /></div>{selection ? <ChallengeCard selection={selection} levelTitle={levelDefinition?.title ?? level} onAnother={chooseAnother} onChoose={focusLevelChoice} /> : <div className="random-empty card" role="status"><h2>No challenge for this level yet</h2><p>Choose another level above, or return when a lesson is available.</p></div>}</section>
}

function ChallengeCard({ selection, levelTitle, onAnother, onChoose }: { selection: RandomSelection; levelTitle: string; onAnother: () => void; onChoose: () => void }) {
  const { topic, level, variant } = selection
  const expressions = challengeExpressions(variant)
  return <article className="random-card card" aria-labelledby="challenge-topic"><div className="random-card__meta"><span>{levelTitle} · {level.toUpperCase()}</span><span>{topic.category} · {topic.subcategory}</span></div><h2 id="challenge-topic">{topic.title}</h2><p className="random-task">{variant.speakingTask.prompt}</p><h3>Try to use</h3><div className="suggestion-row">{expressions.map((item) => <span className="chip chip--static" key={item.id}>{item.english}</span>)}</div><p className="random-timing">Preparation: {variant.speakingTask.preparationSeconds} seconds · Speaking: {variant.speakingTask.speakingSeconds} seconds</p><SpeakingTimer key={challengeKey(selection)} task={variant.speakingTask} startLabel="Start" /><div className="random-actions"><button className="button button--primary" type="button" onClick={onAnother}>Try another</button><button className="button button--secondary" type="button" onClick={onChoose}>Choose another challenge</button></div></article>
}
