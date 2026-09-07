import type { Exercise } from '../../domain/content-types.ts'

export type PracticeAnswer = string | string[] | Record<string, string>

export function normaliseAnswer(value: string) {
  return value.trim().toLowerCase().replace(/[.!?]+$/, '')
}

export function isPracticeAnswerCorrect(exercise: Exercise, answer: PracticeAnswer) {
  if (exercise.type === 'choice') return answer === exercise.correctOptionId
  if (exercise.type === 'gap') return typeof answer === 'string' && exercise.acceptedAnswers.some((expected) => normaliseAnswer(expected) === normaliseAnswer(answer))
  if (exercise.type === 'match') {
    if (typeof answer !== 'object' || Array.isArray(answer)) return false
    return exercise.pairs.every((pair) => answer[pair.id] === pair.id)
  }
  if (!Array.isArray(answer)) return false
  return exercise.acceptedOrders.some((order) => order.length === answer.length && order.every((token, index) => token === answer[index]))
}
