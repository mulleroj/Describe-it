import type { TopicVariant } from '../../domain/content-types.ts'

export function ExploreStep({ variant, onContinue }: { variant: TopicVariant; onContinue: () => void }) {
  return (
    <section className="lesson-step" aria-labelledby="explore-title">
      <p className="eyebrow">Step 1 · Explore</p>
      <h2 id="explore-title">Meet the words</h2>
      <p className="step-intro">Read the English first. Open Czech help only when you need it.</p>
      <div className="word-grid">
        {variant.vocabulary.map((item) => (
          <article className="word-card card" key={item.id}>
            <h3>{item.english}</h3>
            <p className="word-card__explanation">{item.explanationEn}</p>
            <p className="word-card__example">{item.exampleEn}</p>
            <details className="word-card__help">
              <summary>Show Czech help</summary>
              <p>{item.meaningCs}</p>
            </details>
          </article>
        ))}
      </div>
      <div className="step-actions"><button className="button button--primary" type="button" onClick={onContinue}>Ready to practise <span aria-hidden="true">→</span></button></div>
    </section>
  )
}
