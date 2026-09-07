import assert from 'node:assert/strict'
import test from 'node:test'
import type { PreferenceStorage } from '../src/storage/preferences.ts'
import { topics } from '../src/content/topics/index.ts'
import { challengeExpressions, challengeKey, randomSelection } from '../src/random/selection.ts'
import { readLastRandomKey, saveLastRandomKey } from '../src/random/storage.ts'

test('random selection returns only the requested level and usable categories', () => {
  for (const level of ['basic', 'standard', 'challenge'] as const) {
    const selected = randomSelection(topics, level, () => 0)
    assert.ok(selected)
    assert.equal(selected.level, level)
    assert.equal(selected.variant, selected.topic.variants[level])
    assert.ok(['people', 'situations'].includes(selected.topic.category))
    assert.equal(challengeExpressions(selected.variant).length, 3)
  }
})

test('selection excludes coming-soon categories and unavailable variants', () => {
  const comingSoon = structuredClone(topics[0])
  assert.ok(comingSoon)
  comingSoon.category = 'places'
  const missingStandard = structuredClone(topics[1])
  assert.ok(missingStandard)
  delete missingStandard.variants.standard
  assert.equal(randomSelection([comingSoon], 'basic', () => 0), null)
  const selected = randomSelection([missingStandard], 'standard', () => 0)
  assert.equal(selected, null)
})

test('one candidate and empty candidates are safe', () => {
  const onlyTopic = topics[0]
  assert.ok(onlyTopic)
  const selected = randomSelection([onlyTopic], 'challenge', () => 0.99)
  assert.ok(selected)
  assert.equal(selected.topic.id, 'personality')
  assert.equal(randomSelection([], 'basic', () => 0), null)
})

test('previous challenge is avoided when another candidate exists', () => {
  const first = randomSelection(topics, 'basic', () => 0)
  assert.ok(first)
  const next = randomSelection(topics, 'basic', () => 0, challengeKey(first))
  assert.ok(next)
  assert.notEqual(challengeKey(next), challengeKey(first))
})

test('random storage fails closed when localStorage is unavailable', () => {
  const failingStorage: () => PreferenceStorage = () => ({ getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } })
  assert.equal(readLastRandomKey(failingStorage), null)
  assert.equal(saveLastRandomKey('personality:basic', failingStorage), false)
})
