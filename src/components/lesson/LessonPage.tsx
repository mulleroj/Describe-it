import { useEffect, useState } from 'react'
import type { LevelId, Topic } from '../../domain/content-types.ts'
import { levels } from '../../content/levels.ts'
import { BuildStep } from './BuildStep.tsx'
import { DescribeStep } from './DescribeStep.tsx'
import { ExploreStep } from './ExploreStep.tsx'
import { PracticeStep } from './PracticeStep.tsx'
import { SpeakingStep } from './SpeakingStep.tsx'

const steps = [
  { id: 'explore', label: 'Explore', description: 'Discover useful words' },
  { id: 'practice', label: 'Practice', description: 'Put them to work' },
  { id: 'build', label: 'Build', description: 'Shape your sentences' },
  { id: 'describe', label: 'Describe', description: 'Make it your own' },
  { id: 'speak', label: 'Speak', description: 'Say it with confidence' },
] as const
type StepId = (typeof steps)[number]['id']

export function LessonPage({ topic, level }: { topic: Topic; level: LevelId }) {
  const variant = topic.variants[level]
  const [activeStep, setActiveStep] = useState<StepId>('explore')
  const levelDefinition = levels.find((entry) => entry.id === level)

  useEffect(() => { document.title = `${topic.title} · ${levelDefinition?.title ?? level} · Describe It!` }, [level, levelDefinition?.title, topic.title])
  if (!variant) return null

  function goToStep(step: StepId) {
    setActiveStep(step)
    window.setTimeout(() => document.getElementById(`${step}-title`)?.focus(), 0)
  }

  return <div className="lesson-page"><header className="lesson-header"><p className="eyebrow">People · Personality · {levelDefinition?.title} · {levelDefinition?.cefr.join('/')}</p><h1>{topic.title}</h1><p className="lesson-goal"><strong>Goal:</strong> {variant.learningGoal}</p></header><nav className="lesson-nav" aria-label="Learning path"><ol>{steps.map((step, index) => <li key={step.id}><button type="button" className={activeStep === step.id ? 'is-active' : ''} aria-current={activeStep === step.id ? 'step' : undefined} onClick={() => goToStep(step.id)}><span className="lesson-nav__number">0{index + 1}</span><span><strong>{step.label}</strong><small>{step.description}</small></span></button></li>)}</ol></nav><div className="lesson-content">{activeStep === 'explore' && <ExploreStep variant={variant} onContinue={() => goToStep('practice')} />}{activeStep === 'practice' && <PracticeStep variant={variant} />}{activeStep === 'build' && <BuildStep variant={variant} />}{activeStep === 'describe' && <DescribeStep variant={variant} />}{activeStep === 'speak' && <SpeakingStep variant={variant} />}</div></div>
}
