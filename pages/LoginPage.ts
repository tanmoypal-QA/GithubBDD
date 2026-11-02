import type { Page } from "playwright";

// A Page Object Model keeps locators and browser interactions out of step files.
export class LoginPage {
  private readonly usernameInput;
  private readonly passwordInput;
  private readonly loginButton;
  private readonly loginError;
  private readonly inventoryContainer;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.loginError = page.locator('[data-test="error"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
  }

  async navigateToLoginPage(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await this.page.waitForURL(/\/inventory\.html(?:[?#].*)?$/);
    await this.inventoryContainer.waitFor({ state: "visible" });
  }

  async verifyLoginError(): Promise<void> {
    await this.loginError.waitFor({ state: "visible" });
    const errorText = await this.loginError.innerText();
    if (!errorText.trim()) {
      throw new Error("The login error message was empty.");
    }
  }
}
