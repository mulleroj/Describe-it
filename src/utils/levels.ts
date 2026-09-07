import { LEVEL_IDS, type LevelId } from '../domain/content-types.ts'

export function isLevelId(value: unknown): value is LevelId {
  return typeof value === 'string' && LEVEL_IDS.some((level) => level === value)
}
