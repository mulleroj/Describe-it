import { useParams } from 'react-router'
import { catalog } from '../content/catalog.ts'
import { isLevelId } from '../utils/levels.ts'
import { EmptyState } from '../components/ui/EmptyState.tsx'
import { LessonPage } from '../components/lesson/LessonPage.tsx'

export function TopicPage() {
  const { topicId, level } = useParams()
  const topic = catalog.ok ? catalog.data.find((entry) => entry.id === topicId) : undefined
  if (level !== undefined && !isLevelId(level)) {
    return <EmptyState eyebrow="Level unavailable" title="We couldn’t find that level." description="Choose Basic, Standard or Challenge from the start page." />
  }
  if (!topic) {
    return <EmptyState eyebrow="Topic unavailable" title="We couldn’t find that topic." description="This lesson has not been published. Return to the start page to choose your level." />
  }
  if (level && !topic.variants[level]) {
    return <EmptyState eyebrow="Level unavailable" title="This level isn’t ready yet." description="This topic has no content at the requested level. Return to the start page to choose another level." />
  }
  return <LessonPage topic={topic} level={level ?? 'basic'} />
}
