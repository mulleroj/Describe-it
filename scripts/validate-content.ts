import { topics } from '../src/content/topics/index.ts'
import { validateTopics } from '../src/validation/content-validation.ts'

const result = validateTopics(topics)
if (!result.ok) {
  for (const issue of result.issues) console.error(`${issue.path}: ${issue.message}`)
  process.exitCode = 1
} else {
  console.log(`Content validation passed: ${result.data.length} published topic(s).`)
}
