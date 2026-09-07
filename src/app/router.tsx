import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router'
import { AppLayout } from './AppLayout.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { TopicsPage } from '../pages/TopicsPage.tsx'
import { TopicPage } from '../pages/TopicPage.tsx'
import { RandomChallengePage } from '../pages/RandomChallengePage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

function QueueAliasRedirect() {
  const { level } = useParams()
  return <Navigate replace to={`/topics/waiting-in-a-queue/${level ?? 'basic'}`} />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/queue/:level" element={<QueueAliasRedirect />} />
          <Route path="/topics/:topicId" element={<TopicPage />} />
          <Route path="/topics/:topicId/:level" element={<TopicPage />} />
          <Route path="/random" element={<RandomChallengePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
