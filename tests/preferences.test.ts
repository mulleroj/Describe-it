import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_LEVEL, LEVEL_STORAGE_KEY, readLevel, saveLevel, type PreferenceStorage } from '../src/storage/preferences.ts'

test('reads and persists only the selected level', () => {
  const entries = new Map<string, string>()
  const storage: PreferenceStorage = {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value) },
  }
  assert.equal(readLevel(() => storage), DEFAULT_LEVEL)
  assert.equal(saveLevel('challenge', () => storage), true)
  assert.equal(readLevel(() => storage), 'challenge')
  assert.deepEqual([...entries], [[LEVEL_STORAGE_KEY, 'challenge']])
})

test('unknown and corrupt stored values fall back to Basic', () => {
  for (const value of [null, '', 'A2', 'advanced', '{"level":"basic"}', 'STANDARD']) {
    assert.equal(readLevel(() => ({ getItem: () => value, setItem: () => {} })), 'basic')
  }
})

test('denied localStorage property access does not escape', () => {
  const denied = (): PreferenceStorage => { throw new Error('SecurityError') }
  assert.equal(readLevel(denied), 'basic')
  assert.equal(saveLevel('standard', denied), false)
})

test('read and quota failures are safe', () => {
  const broken: PreferenceStorage = {
    getItem: () => { throw new Error('Storage is blocked') },
    setItem: () => { throw new Error('QuotaExceededError') },
  }
  assert.equal(readLevel(() => broken), 'basic')
  assert.equal(saveLevel('standard', () => broken), false)
})
