import { useEffect, useRef, useState } from 'react'
import type { LearningItem, SpeakingTask, TopicVariant } from '../../domain/content-types.ts'

type TimerPhase = 'preparation' | 'speaking' | 'finished'

function formatTime(seconds: number) { const total = Math.max(0, Math.ceil(seconds)); return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}` }

export function SpeakingTimer({ task, startLabel = 'Start preparation' }: { task: SpeakingTask; startLabel?: string }) {
  const [phase, setPhase] = useState<TimerPhase>('preparation')
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [announcement, setAnnouncement] = useState('Ready when you are.')
  const startedAt = useRef(0)
  const elapsedAtPause = useRef(0)

  useEffect(() => {
    if (!running || phase === 'finished') return
    let frame = 0
    const target = phase === 'preparation' ? task.preparationSeconds : task.speakingSeconds
    const tick = (now: number) => {
      const next = Math.min(target, (now - startedAt.current) / 1000)
      setElapsed(next)
      if (next >= target) {
        if (phase === 'preparation') {
          startedAt.current = now
          elapsedAtPause.current = 0
          setElapsed(0)
          setPhase('speaking')
          setAnnouncement('Preparation finished. Speaking time has started.')
          setRunning(true)
        } else {
          setRunning(false)
          setPhase('finished')
          setAnnouncement('Speaking time finished.')
        }
        return
      }
      frame = requestAnimationFrame(tick)
    }
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') tick(performance.now()) }
    document.addEventListener('visibilitychange', onVisibilityChange)
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onVisibilityChange) }
  }, [phase, running, task.preparationSeconds, task.speakingSeconds])

  function startPreparation() { startedAt.current = performance.now(); elapsedAtPause.current = 0; setElapsed(0); setPhase('preparation'); setAnnouncement('Preparation started.'); setRunning(true) }
  function syncElapsed() { const target = phase === 'preparation' ? task.preparationSeconds : task.speakingSeconds; const next = Math.min(target, (performance.now() - startedAt.current) / 1000); elapsedAtPause.current = next; setElapsed(next) }
  function pause() { syncElapsed(); setRunning(false); setAnnouncement('Timer paused.') }
  function resume() { startedAt.current = performance.now() - elapsedAtPause.current * 1000; setRunning(true); setAnnouncement(phase === 'preparation' ? 'Preparation resumed.' : 'Speaking resumed.') }
  function restart() { startPreparation() }
  function skipPreparation() { startedAt.current = performance.now(); elapsedAtPause.current = 0; setElapsed(0); setPhase('speaking'); setAnnouncement('Preparation skipped. Speaking time has started.'); setRunning(true) }
  function finish() { syncElapsed(); setRunning(false); setPhase('finished'); setAnnouncement('Speaking challenge finished.') }
  const target = phase === 'preparation' ? task.preparationSeconds : task.speakingSeconds
  const remaining = phase === 'finished' ? 0 : target - elapsed
  const progress = target === 0 ? 100 : (elapsed / target) * 100
  return <div className="timer-card card"><p className="timer-phase">{phase === 'preparation' ? 'Preparation' : phase === 'speaking' ? 'Speak now' : 'Finished'}</p><div className="timer-value" aria-label={`${formatTime(remaining)} remaining`}>{formatTime(remaining)}</div><div className="timer-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div><p className="timer-announcement" role="status" aria-live="polite">{announcement}</p><div className="timer-actions">{!running && phase === 'preparation' && elapsed === 0 && <button className="button button--primary" type="button" onClick={startPreparation}>{startLabel}</button>}{running && <button className="button button--secondary" type="button" onClick={pause}>Pause</button>}{!running && phase !== 'finished' && elapsed > 0 && <button className="button button--primary" type="button" onClick={resume}>Resume</button>}{phase === 'preparation' && <button className="button button--secondary" type="button" onClick={skipPreparation}>Skip preparation</button>}{phase !== 'preparation' && phase !== 'finished' && <button className="button button--secondary" type="button" onClick={finish}>Finish</button>}<button className="button button--secondary" type="button" onClick={restart}>Restart</button></div></div>
}

export function SpeakingStep({ variant }: { variant: TopicVariant }) {
  const items = [...variant.vocabulary, ...variant.phrases, ...variant.collocations, ...variant.sentenceStarters] as LearningItem[]
  return <section className="lesson-step" aria-labelledby="speak-title"><p className="eyebrow">Step 5 · Speak</p><h2 id="speak-title" tabIndex={-1}>{variant.speakingTask.prompt}</h2><p className="step-intro">No microphone is needed. Prepare your ideas, then say them aloud.</p><div className="speaking-layout"><div className="speaking-brief card"><h3>Your challenge</h3><p>Preparation: {variant.speakingTask.preparationSeconds} seconds</p><p>Speaking: {variant.speakingTask.speakingSeconds} seconds</p><h3>Word help</h3><div className="suggestion-row">{variant.speakingTask.suggestedItemIds.map((id) => { const item = items.find((entry) => entry.id === id); return item ? <span className="chip chip--static" key={id}>{item.english}</span> : null })}</div></div><SpeakingTimer task={variant.speakingTask} /></div></section>
}
