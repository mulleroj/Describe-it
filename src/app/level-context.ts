import { createContext, useContext } from 'react'
import type { LevelId } from '../domain/content-types.ts'

export interface LevelPreference {
  level: LevelId
  selectLevel: (level: LevelId) => void
  sessionOnly: boolean
}

export const LevelContext = createContext<LevelPreference | null>(null)

export function useLevel() {
  const context = useContext(LevelContext)
  if (!context) throw new Error('useLevel must be used inside LevelProvider.')
  return context
}
