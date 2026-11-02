import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import { frameworkConfig } from "../config/config";
import { LoginPage } from "../pages/LoginPage";
import type { ScenarioWorld } from "../hooks/hooks";

// Step definitions translate each Gherkin sentence into a page-object action.
Given("I navigate to the login page", async function (this: ScenarioWorld) {
  assert.ok(this.page, "Playwright Page was not created by the Before hook.");
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage(frameworkConfig.baseUrl);
});

When(
  "I enter valid username and password",
  async function (this: ScenarioWorld) {
    assert.ok(this.loginPage, "Login page has not been initialized.");
    assert.ok(frameworkConfig.username, "USERNAME is missing from the environment.");
    assert.ok(frameworkConfig.password, "PASSWORD is missing from the environment.");
    await this.loginPage.enterUsername(frameworkConfig.username);
    await this.loginPage.enterPassword(frameworkConfig.password);
  }
);

When(
  "I enter invalid username and password",
  async function (this: ScenarioWorld) {
    assert.ok(this.loginPage, "Login page has not been initialized.");
    await this.loginPage.enterUsername("invalid_user");
    await this.loginPage.enterPassword("invalid_password");
  }
);

When("I click the login button", async function (this: ScenarioWorld) {
  assert.ok(this.loginPage, "Login page has not been initialized.");
  await this.loginPage.clickLogin();
});

Then(
  "I should be successfully logged in",
  async function (this: ScenarioWorld) {
    assert.ok(this.loginPage, "Login page has not been initialized.");
    await this.loginPage.verifySuccessfulLogin();
  }
);

Then(
  "I should see a login error message",
  async function (this: ScenarioWorld) {
    assert.ok(this.loginPage, "Login page has not been initialized.");
    await this.loginPage.verifyLoginError();
  }
);
