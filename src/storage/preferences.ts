import type { LevelId } from '../domain/content-types.ts'
import { isLevelId } from '../utils/levels.ts'

export const LEVEL_STORAGE_KEY = 'describe-it:level:v1'
export const DEFAULT_LEVEL: LevelId = 'basic'

export interface PreferenceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

type StorageProvider = () => PreferenceStorage
const browserStorage: StorageProvider = () => globalThis.localStorage

export function readLevel(getStorage: StorageProvider = browserStorage): LevelId {
  try {
    const value = getStorage().getItem(LEVEL_STORAGE_KEY)
    return isLevelId(value) ? value : DEFAULT_LEVEL
  } catch {
    return DEFAULT_LEVEL
  }
}

export function saveLevel(level: LevelId, getStorage: StorageProvider = browserStorage): boolean {
  try {
    getStorage().setItem(LEVEL_STORAGE_KEY, level)
    return true
  } catch {
    // React state remains usable when storage access or writes are denied.
    return false
  }
}
