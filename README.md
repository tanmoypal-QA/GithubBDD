# Playwright + TypeScript + Cucumber BDD Framework

This project runs Cucumber scenarios against SauceDemo using Playwright as the browser automation library. Cucumber is the BDD runner; the Playwright Test runner is not used.

## Project architecture

```text
features/                 Gherkin behavior specifications
step-definitions/         Cucumber steps connected to page objects
pages/                    Locators and browser interaction (Page Object Model)
hooks/                    Browser setup/cleanup and failure screenshots
config/                   Environment selection and configuration
test-runner/              Cucumber launcher and HTML report setup
utils/                    Small shared utilities
reports/                  Generated HTML reports
screenshots/              PNG screenshots captured for failed scenarios
cucumber.js               Cucumber support-file and TypeScript configuration
playwright.config.ts      Shared Playwright browser settings
```

## Installation

From the project directory:

```bash
npm install
```

Install the supported Playwright browsers:

```bash
npx playwright install
```

On Linux CI systems, install browser operating-system dependencies as well:

```bash
npx playwright install --with-deps
```

## Environment configuration

The framework selects `config/.env.qa` by default. Choose QA or UAT using `TEST_ENV`:

```powershell
$env:TEST_ENV="qa"
npm run test:bdd
```

```powershell
$env:TEST_ENV="uat"
npm run test:bdd
```

Configure `BASE_URL`, `USERNAME`, `PASSWORD`, `BROWSER`, `HEADLESS`, and `TIMEOUT` in the selected environment file. Local environment files are ignored by Git. The supplied QA/UAT files use the requested SauceDemo test account. Shell environment variables take precedence over values loaded from the file.

On Windows, `USERNAME` is commonly pre-populated with the signed-in OS account name. The framework therefore reads `USERNAME` from the selected environment file first; use `SAUCE_USERNAME` to explicitly override it from the shell.

Supported `BROWSER` values are `chromium`, `firefox`, and `webkit`. `HEADLESS` accepts `true` or `false`; `TIMEOUT` is in milliseconds.

## Run BDD scenarios

Run all features:

```bash
npm run test:bdd
```

Run a specific feature:

```bash
npm run test:bdd -- features/login.feature
```

Run a specific tag:

```bash
npx cucumber-js --tags "@smoke"
```

Run a specific scenario by name:

```bash
npx cucumber-js --name "Successful login with valid credentials"
```

Run the browser in headed mode:

```bash
npm run test:bdd:headed
```

You can also configure browser and headed mode directly:

```powershell
$env:BROWSER="firefox"
$env:HEADLESS="false"
npm run test:bdd
```

## HTML report and screenshots

The `test:bdd` and `test:bdd:html` commands both generate a readable Cucumber HTML report at `reports/cucumber-report.html`. It includes feature/scenario/step results, timing, failure details, and embedded screenshots attached by the failure hook.

Failed scenarios also save a full-page PNG under `screenshots/`. The `After` hook captures the screenshot, saves it, and attaches the image to the Cucumber result. Cucumber marks the scenario failed from the original step error and continues with subsequent scenarios by default.

To run Cucumber directly and produce the same HTML report:

```bash
npx cucumber-js --format html:reports/cucumber-report.html
```

## How it works

1. Cucumber reads `features/login.feature`, where Gherkin describes the behavior.
2. Cucumber matches each `Given`, `When`, and `Then` step to `step-definitions/login.steps.ts`.
3. Step definitions use `LoginPage` methods instead of duplicating UI logic.
4. `LoginPage` uses Playwright's `Page` API to locate elements and interact with the app.
5. The `Before` hook launches the selected Browser, creates an isolated `BrowserContext`, and opens a `Page`.
6. Playwright drives the SauceDemo application. On failure, the `After` hook captures and attaches a screenshot, then closes the Page, context, and browser.
7. Cucumber records step outcomes and writes the HTML report.

```text
Feature File
     ↓
Cucumber
     ↓
Step Definition
     ↓
Page Object
     ↓
Playwright
     ↓
Browser
     ↓
Application
     ↓
Cucumber Report
```
