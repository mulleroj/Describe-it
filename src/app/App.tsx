import { catalog } from '../content/catalog.ts'
import { AppRouter } from './router.tsx'
import { LevelProvider } from './LevelProvider.tsx'

export function App() {
  if (!catalog.ok) {
    return <main className="container empty-state"><h1>Content is temporarily unavailable.</h1><p>Please try again later.</p></main>
  }
  return <LevelProvider><AppRouter /></LevelProvider>
}
