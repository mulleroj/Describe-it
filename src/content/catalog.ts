import { topics } from './topics/index.ts'
import { validateTopics } from '../validation/content-validation.ts'

// A second runtime boundary protects development and future runtime loading.
export const catalog = validateTopics(topics)
