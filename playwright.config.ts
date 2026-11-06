import { defineConfig } from "@playwright/test";

const exe =
  process.env.CHROMIUM_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3917", launchOptions: { executablePath: exe } },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
