import type { LevelDefinition } from '../domain/content-types.ts'

export const levels = [
  { id: 'basic', title: 'Basic', cefr: ['A1', 'A2'], description: 'Start with simple words and short sentences.' },
  { id: 'standard', title: 'Standard', cefr: ['A2', 'B1'], description: 'Add detail and connect your ideas.' },
  { id: 'challenge', title: 'Challenge', cefr: ['B1', 'B2'], description: 'Be more precise. Express the finer details.' },
] as const satisfies readonly LevelDefinition[]
