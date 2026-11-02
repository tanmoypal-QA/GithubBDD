import { frameworkConfig } from "./config/config";

// Shared browser settings consumed by the Cucumber hooks, not Playwright Test.
const playwrightConfig = {
  use: {
    baseURL: frameworkConfig.baseUrl,
    browserName: frameworkConfig.browserName,
    headless: frameworkConfig.headless
  },
  timeout: frameworkConfig.timeout
};

export default playwrightConfig;
