import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// Cucumber, not Playwright Test, executes scenarios and produces the HTML report.
async function run(): Promise<void> {
  const reportsDirectory = path.resolve(process.cwd(), "reports");
  await mkdir(reportsDirectory, { recursive: true });

  const cucumberCli = path.resolve(
    process.cwd(),
    "node_modules",
    "@cucumber",
    "cucumber",
    "bin",
    "cucumber.js"
  );
  const forwardedArguments = process.argv.slice(2);
  const result = spawnSync(
    process.execPath,
    [
      cucumberCli,
      "--format",
      "progress",
      "--format",
      "html:reports/cucumber-report.html",
      ...forwardedArguments
    ],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit"
    }
  );

  if (result.error) {
    throw new Error(`Unable to start Cucumber: ${result.error.message}`, {
      cause: result.error
    });
  }
  process.exitCode = result.status ?? 1;
}

run().catch((error: unknown) => {
  console.error("BDD test runner failed:", error);
  process.exitCode = 1;
});
