import type { PreferenceStorage } from '../storage/preferences.ts'

export const RANDOM_LAST_STORAGE_KEY = 'describe-it:random:last:v1'
type StorageProvider = () => PreferenceStorage
const browserStorage: StorageProvider = () => globalThis.localStorage

export function readLastRandomKey(getStorage: StorageProvider = browserStorage): string | null {
  try { return getStorage().getItem(RANDOM_LAST_STORAGE_KEY) }
  catch { return null }
}

export function saveLastRandomKey(key: string, getStorage: StorageProvider = browserStorage): boolean {
  try { getStorage().setItem(RANDOM_LAST_STORAGE_KEY, key); return true }
  catch { return false }
}
