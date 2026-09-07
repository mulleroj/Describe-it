import { useState } from 'react'
import type { LearningItem, TopicVariant } from '../../domain/content-types.ts'

function itemsFor(variant: TopicVariant) {
  return [...variant.vocabulary, ...variant.phrases, ...variant.collocations, ...variant.sentenceStarters] as LearningItem[]
}

export function BuildStep({ variant }: { variant: TopicVariant }) {
  const [values, setValues] = useState<Record<string, string[]>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const items = itemsFor(variant)

  function updateValue(taskId: string, slot: number, slotCount: number, value: string) {
    setValues((previous) => ({ ...previous, [taskId]: (previous[taskId] ?? Array(slotCount).fill('')).map((entry, index) => index === slot ? value : entry) }))
  }
  function addSuggestion(taskId: string, suggestion: string, slots: string[]) {
    const next = [...(values[taskId] ?? Array(slots.length).fill(''))]
    const index = next.findIndex((value) => value.length === 0)
    if (index >= 0) next[index] = suggestion
    setValues((previous) => ({ ...previous, [taskId]: next }))
  }

  return <section className="lesson-step" aria-labelledby="build-title"><p className="eyebrow">Step 3 · Build</p><h2 id="build-title" tabIndex={-1}>Shape your sentences</h2><p className="step-intro">Use a frame, then make it yours. Your writing stays in this session and is never sent anywhere.</p><div className="build-list">{variant.buildTasks.map((task) => { const parts = task.template.split('___'); const slots = parts.length - 1; const taskValues = values[task.id] ?? Array(slots).fill(''); return <article className="build-card card" key={task.id}><h3>{task.template.replaceAll('___', '…')}</h3><p className="template-line">{parts.map((part, index) => <span key={`${task.id}-${index}`}>{part}{index < slots && <label><span className="sr-only">Your words for blank {index + 1}</span><input value={taskValues[index] ?? ''} onChange={(event) => updateValue(task.id, index, slots, event.target.value)} placeholder="your words" autoComplete="off" /></label>}</span>)}</p><div className="suggestion-row" aria-label="Word help">{task.suggestedItemIds.map((id) => { const item = items.find((entry) => entry.id === id); return item ? <button className="chip" type="button" key={id} onClick={() => addSuggestion(task.id, item.english, Array(slots).fill(''))}>{item.english}</button> : null })}</div></article>})}</div><fieldset className="self-check"><legend>Self-check</legend>{variant.buildChecklist.map((item, index) => <label key={item}><input type="checkbox" checked={checked[`${index}`] ?? false} onChange={(event) => setChecked((previous) => ({ ...previous, [`${index}`]: event.target.checked }))} /> <span>{item}</span></label>)}</fieldset></section>
}
