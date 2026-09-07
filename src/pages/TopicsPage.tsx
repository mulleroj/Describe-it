import { useLevel } from '../app/level-context.ts'
import { levels } from '../content/levels.ts'
import { catalog } from '../content/catalog.ts'
import { categories } from '../content/categories.ts'
import { Link } from 'react-router'

export function TopicsPage() {
  const { level } = useLevel()
  const selected = levels.find((entry) => entry.id === level)
  const published = catalog.ok ? catalog.data : []
  return <section className="topics-page" aria-labelledby="topics-title"><p className="eyebrow">{selected?.title} · {selected?.cefr.join('/')}</p><h1 id="topics-title">Choose a topic</h1><p className="step-intro">Start with one useful situation and build towards your own words.</p>{categories.map((category) => { const categoryTopics = published.filter((topic) => topic.category === category.id); return <section className="topic-group" aria-labelledby={`category-${category.id}`} key={category.id}><h2 id={`category-${category.id}`}>{category.title}</h2>{categoryTopics.length > 0 ? <div className="topic-grid">{categoryTopics.map((topic) => <article className="topic-card card" key={topic.id}><span className="eyebrow">{topic.subcategory}</span><h3>{topic.title}</h3><p>{topic.shortDescription}</p><div className="level-links" aria-label={`Levels for ${topic.title}`}>{(['basic', 'standard', 'challenge'] as const).map((topicLevel) => topic.variants[topicLevel] ? <Link className={topicLevel === level ? 'is-selected' : ''} to={`/topics/${topic.id}/${topicLevel}`} key={topicLevel}>{topicLevel}</Link> : <span className="is-disabled" aria-disabled="true" key={topicLevel}>{topicLevel}<small>Coming soon</small></span>)}</div></article>)}</div> : <div className="coming-soon-grid">{category.subcategories.map((subcategory) => <div className="coming-soon-card card" aria-disabled="true" key={subcategory.id}><h3>{subcategory.title}</h3><span>Coming soon</span></div>)}</div>}</section>})}</section>
}
