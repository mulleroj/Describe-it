import { levels } from '../../content/levels.ts'
import { useLevel } from '../../app/level-context.ts'

export function LevelSelector() {
  const { level, selectLevel, sessionOnly } = useLevel()
  return (
    <fieldset className="level-selector" aria-describedby="level-help">
      <legend>Where would you like to start?</legend>
      <p id="level-help" className="muted">Choose your level. You can change it any time.</p>
      <div className="level-grid">
        {levels.map((option, index) => (
          <label key={option.id} className={`level-card card ${level === option.id ? 'is-selected' : ''}`}>
            <input type="radio" name="level" value={option.id} checked={level === option.id} onChange={() => selectLevel(option.id)} aria-labelledby={`${option.id}-title ${option.id}-range`} aria-describedby={`${option.id}-description`} />
            <span className="level-card__top">
              <span className="level-mark" aria-hidden="true">
                {[0, 1, 2].map((bar) => <span key={bar} className={bar <= index ? 'is-filled' : ''} />)}
              </span>
              <span id={`${option.id}-range`} className="level-card__range">{option.cefr.join('/')}</span>
            </span>
            <span id={`${option.id}-title`} className="level-card__title">{option.title}</span>
            <span id={`${option.id}-description`} className="level-card__description">{option.description}</span>
          </label>
        ))}
      </div>
      <p className="storage-note" role="status">{sessionOnly ? 'Your level is selected for this visit. It could not be saved for next time.' : 'No account needed. Just a little curiosity.'}</p>
    </fieldset>
  )
}
