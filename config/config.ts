import dotenv from "dotenv";
import path from "node:path";

export type BrowserName = "chromium" | "firefox" | "webkit";

const selectedEnvironment = process.env.TEST_ENV ?? "qa";

if (selectedEnvironment !== "qa" && selectedEnvironment !== "uat") {
  throw new Error(
    `Unsupported TEST_ENV "${selectedEnvironment}". Choose "qa" or "uat".`
  );
}

const environmentPath = path.resolve(
  process.cwd(),
  "config",
  `.env.${selectedEnvironment}`
);
const environmentFile = dotenv.config({ path: environmentPath });
if (environmentFile.error) {
  throw new Error(
    `Could not load environment file "${environmentPath}": ${environmentFile.error.message}`
  );
}

const configuredBrowser = process.env.BROWSER ?? "chromium";
if (!["chromium", "firefox", "webkit"].includes(configuredBrowser)) {
  throw new Error(
    `Unsupported BROWSER "${configuredBrowser}". Choose chromium, firefox, or webkit.`
  );
}

const timeout = Number(process.env.TIMEOUT ?? 30_000);
if (!Number.isFinite(timeout) || timeout <= 0) {
  throw new Error("TIMEOUT must be a positive number of milliseconds.");
}

function readBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  throw new Error(`Expected "true" or "false", received "${value}".`);
}

// Environment files supply credentials; they are never embedded in test code.
export const frameworkConfig = {
  environment: selectedEnvironment,
  baseUrl: process.env.BASE_URL ?? "https://www.saucedemo.com/",
  username:
    process.env.SAUCE_USERNAME ??
    environmentFile.parsed?.USERNAME ??
    process.env.USERNAME ??
    "",
  password: process.env.PASSWORD ?? "",
  browserName: configuredBrowser as BrowserName,
  headless: readBoolean(process.env.HEADLESS, true),
  timeout
};
