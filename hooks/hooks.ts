import {
  After,
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  World,
  type IWorldOptions
} from "@cucumber/cucumber";
import {
  chromium,
  firefox,
  webkit,
  type Browser,
  type BrowserType,
  type BrowserContext,
  type Page
} from "playwright";
import { frameworkConfig } from "../config/config";
import type { BrowserName } from "../config/config";
import { sanitizeFileName } from "../utils/fileUtils";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// The Browser launches the engine; each BrowserContext isolates scenario state
// and contains the Playwright Page (a single browser tab).
export class ScenarioWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  loginPage?: import("../pages/LoginPage").LoginPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(ScenarioWorld);
setDefaultTimeout(frameworkConfig.timeout);

Before(async function (this: ScenarioWorld) {
  const browserTypes: Record<BrowserName, BrowserType> = {
    chromium,
    firefox,
    webkit
  };
  const browserType = browserTypes[frameworkConfig.browserName];

  const browser = await browserType.launch({
    headless: frameworkConfig.headless
  });
  this.browser = browser;
  const context = await browser.newContext();
  this.context = context;
  this.page = await context.newPage();
});

After(async function (this: ScenarioWorld, scenario) {
  try {
    if (scenario.result?.status === "FAILED" && this.page) {
      const screenshotDirectory = path.resolve(process.cwd(), "screenshots");
      await mkdir(screenshotDirectory, { recursive: true });

      const screenshotName = `${sanitizeFileName(scenario.pickle.name)}-${Date.now()}.png`;
      const screenshotPath = path.join(screenshotDirectory, screenshotName);
      const screenshot = await this.page.screenshot({ fullPage: true });

      await writeFile(screenshotPath, screenshot);
      await this.attach(screenshot, "image/png");
      console.error(`Failure screenshot saved to ${screenshotPath}`);
    }
  } finally {
    try {
      await this.page?.close();
    } finally {
      try {
        await this.context?.close();
      } finally {
        await this.browser?.close();
      }
    }
  }
});
