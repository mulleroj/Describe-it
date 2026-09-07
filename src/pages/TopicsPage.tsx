import { useLevel } from '../app/level-context.ts'
import { levels } from '../content/levels.ts'
import { EmptyState } from '../components/ui/EmptyState.tsx'
import { catalog } from '../content/catalog.ts'
import { Link } from 'react-router'

export function TopicsPage() {
  const { level } = useLevel()
  const selected = levels.find((entry) => entry.id === level)
  const available = catalog.ok ? catalog.data.filter((topic) => topic.variants[level]) : []
  if (available.length === 0) return <EmptyState eyebrow={`${selected?.title} · ${selected?.cefr.join('/')}`} title="Your topics are on the way." description="The first lessons are being prepared. Your level is selected — come back when there is something to explore." />
  return <section className="topics-page" aria-labelledby="topics-title"><p className="eyebrow">{selected?.title} · {selected?.cefr.join('/')}</p><h1 id="topics-title">Choose a topic</h1><p className="step-intro">Start with one useful situation and build towards your own words.</p><div className="topic-grid">{available.map((topic) => <Link className="topic-card card" to={`/topics/${topic.id}/${level}`} key={topic.id}><span className="eyebrow">{topic.category} · {topic.subcategory}</span><h2>{topic.title}</h2><p>{topic.shortDescription}</p><span className="topic-card__cta">Start lesson <span aria-hidden="true">→</span></span></Link>)}</div></section>
}
