import { ButtonLink } from './ButtonLink.tsx'
import { Icon } from './Icon.tsx'

interface EmptyStateProps { eyebrow: string; title: string; description: string }

export function EmptyState({ eyebrow, title, description }: EmptyStateProps) {
  return (
    <section className="empty-state card" aria-labelledby="page-title">
      <span className="empty-state__icon"><Icon name="speech" /></span>
      <p className="eyebrow">{eyebrow}</p>
      <h1 id="page-title">{title}</h1>
      <p className="body-copy">{description}</p>
      <ButtonLink to="/">Back to start <Icon name="arrow" /></ButtonLink>
    </section>
  )
}
