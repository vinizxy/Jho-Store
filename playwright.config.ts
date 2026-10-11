import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    browserName: "chromium",
    viewport: { width: 375, height: 812 },
    locale: "pt-BR",
    baseURL: "http://localhost:3100",
  },
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
})
