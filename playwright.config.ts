import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from '@playwright/test'

function findLocalChromium() {
  if (process.env.PLAYWRIGHT_CHROMIUM_PATH) return process.env.PLAYWRIGHT_CHROMIUM_PATH
  if (process.platform !== 'win32' || !process.env.LOCALAPPDATA) return undefined

  const browserRoot = path.join(process.env.LOCALAPPDATA, 'ms-playwright')
  if (!fs.existsSync(browserRoot)) return undefined
  const folders = fs.readdirSync(browserRoot).filter((name) => /^chromium-\d+$/.test(name)).sort().reverse()
  const preferred = folders.includes('chromium-1228') ? ['chromium-1228', ...folders.filter((folder) => folder !== 'chromium-1228')] : folders
  for (const folder of preferred) {
    const executable = path.join(browserRoot, folder, 'chrome-win64', 'chrome.exe')
    if (fs.existsSync(executable)) return executable
  }
  return undefined
}

const localChromium = findLocalChromium()

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: localChromium ? { executablePath: localChromium } : undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
