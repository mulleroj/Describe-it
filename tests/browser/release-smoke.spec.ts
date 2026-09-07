import { expect, test } from '@playwright/test'

test('homepage lets a learner choose a level and open the catalog', async ({ page }) => {
  await page.goto('/')

  const standard = page.getByRole('radio', { name: /Standard/ })
  await page.getByText('Standard', { exact: true }).click()
  await expect(standard).toBeChecked()

  await page.getByRole('link', { name: /Choose a topic/ }).click()
  await expect(page).toHaveURL(/\/topics$/)
  await expect(page.getByRole('heading', { name: 'Choose a topic' })).toBeVisible()
})

test('lesson navigation reaches Explore, Practice, Build, Describe and Speak', async ({ page }) => {
  await page.goto('/topics/personality/basic')
  await expect(page.getByRole('heading', { name: 'Meet the words' })).toBeVisible()

  const steps = [
    [/02 Practice/, 'Try it four ways'],
    [/03 Build/, 'Shape your sentences'],
    [/04 Describe/, 'Describe a good friend.'],
    [/05 Speak/, 'Describe a person you like.'],
  ] as const

  for (const [buttonName, headingName] of steps) {
    await page.getByRole('button', { name: buttonName }).click()
    await expect(page.getByRole('heading', { name: headingName })).toBeVisible()
  }
})

test('random challenge has content, starts its timer and can reroll', async ({ page }) => {
  await page.goto('/random')
  await expect(page.locator('#challenge-topic')).toBeVisible()
  await expect(page.getByText('Preparation:', { exact: false })).toBeVisible()

  await page.getByRole('button', { name: 'Start', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Try another', exact: true }).click()
  await expect(page.locator('#challenge-topic')).toBeVisible()
})

test('deep lesson route opens directly and survives a refresh', async ({ page }) => {
  await page.goto('/topics/smile/standard')
  await expect(page).toHaveURL(/\/topics\/smile\/standard$/)
  await expect(page.getByRole('heading', { name: 'Describing a smile' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Meet the words' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Describing a smile' })).toBeVisible()
})
