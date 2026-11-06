import { defineConfig } from "@playwright/test";
import path from "node:path";

// Browsers live in a project-local folder (the global cache is not writable from the sandbox).
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(".pw-browsers");

const chromiumExe =
  process.env.CHROMIUM_PATH ??
  `${process.env.HOME}/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: process.env.BASE_URL ?? "http://localhost:3917" },
  projects: [
    { name: "chromium", use: { browserName: "chromium", launchOptions: { executablePath: chromiumExe } } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
});
