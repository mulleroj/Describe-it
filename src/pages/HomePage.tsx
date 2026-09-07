import { LevelSelector } from '../components/learning/LevelSelector.tsx'
import { LearningPath } from '../components/learning/LearningPath.tsx'
import { ButtonLink } from '../components/ui/ButtonLink.tsx'
import { Icon } from '../components/ui/Icon.tsx'

export function HomePage() {
  return (
    <>
      <div className="hero">
        <section className="hero__intro" aria-labelledby="home-title">
          <p className="eyebrow"><span className="status-dot" /> Practical English. Your words.</p>
          <h1 id="home-title">Find the words.<br /><span>Make them yours.</span></h1>
          <p className="hero__description">Learn to describe people, places and everyday moments in English. Start with useful words. Build towards your own voice.</p>
          <div className="hero__caption"><span aria-hidden="true" /> Less memorising. More expressing.</div>
        </section>
        <LearningPath />
      </div>
      <section className="start-section" aria-label="Get started">
        <LevelSelector />
        <div className="start-actions">
          <ButtonLink to="/topics">Choose a topic <Icon name="arrow" /></ButtonLink>
          <ButtonLink to="/random" variant="secondary"><Icon name="shuffle" /> Random challenge</ButtonLink>
        </div>
        <p className="availability-note">Personality · Basic is ready. More topics and levels will follow.</p>
      </section>
    </>
  )
}
