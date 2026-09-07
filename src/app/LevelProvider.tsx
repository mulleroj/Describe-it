import { useState, type ReactNode } from 'react'
import type { LevelId } from '../domain/content-types.ts'
import { readLevel, saveLevel } from '../storage/preferences.ts'
import { LevelContext } from './level-context.ts'

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(readLevel)
  const [sessionOnly, setSessionOnly] = useState(false)

  function selectLevel(next: LevelId) {
    setLevel(next)
    setSessionOnly(!saveLevel(next))
  }

  return <LevelContext value={{ level, selectLevel, sessionOnly }}>{children}</LevelContext>
}
