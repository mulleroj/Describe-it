import { learningPath } from '../../content/learning-path.ts'

export function LearningPath() {
  return (
    <aside className="learning-path" aria-labelledby="path-title">
      <p className="eyebrow">The learning journey</p>
      <h2 id="path-title">Small steps. <span>A stronger voice.</span></h2>
      <ol className="path-list">
        {learningPath.map((step, index) => (
          <li key={step.title} className={`path-step path-step--${step.tone}`}>
            <span className="path-step__number" aria-hidden="true">0{index + 1}</span>
            <span><strong>{step.title}</strong><span className="path-step__description">{step.description}</span></span>
            <span className="path-step__dot" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <p className="path-note">From discovering words to speaking for yourself.</p>
    </aside>
  )
}
