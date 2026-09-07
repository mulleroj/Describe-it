import type { Topic } from '../../domain/content-types.ts'
import { personality } from './personality.ts'
import { queue } from './queue.ts'
import { smile } from './smile.ts'

export const topics: Topic[] = [personality, smile, queue]
