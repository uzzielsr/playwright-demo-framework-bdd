import { Page } from '@playwright/test';
import { LoginSelectors } from '../constants/selectors/login.selectors';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('❌ BASE_URL is not defined in the .env file.');
        }

        await this.page.goto(baseUrl);
        await this.page.click(LoginSelectors.loginLink);
    }

    async login(email: string, password: string) {
        await this.page.fill(LoginSelectors.usernameField, email);
        await this.page.fill(LoginSelectors.passwordField, password);
        await this.page.click(LoginSelectors.submitButton);
    }

    async loginWithValidCredentials() {
        const email = process.env.TEST_EMAIL;
        const password = process.env.TEST_PASSWORD;

        if (!email || !password) {
            throw new Error('❌ TEST_EMAIL or TEST_PASSWORD is not defined in the .env file.');
        }

        await this.login(email, password);
    }

    async loginWithInvalidCredentials() {
        const email = process.env.INVALID_EMAIL;
        const password = process.env.INVALID_PASSWORD;

        if (!email || !password) {
            throw new Error('❌ INVALID_EMAIL or INVALID_PASSWORD is not defined in the .env file.');
        }

        await this.login(email, password);
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector(LoginSelectors.homeTitle, { timeout: 5000 });
            await this.page.waitForSelector(LoginSelectors.loggedInIndicator, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isErrorDisplayed(): Promise<boolean> {
        try {
            await this.page.waitForSelector(LoginSelectors.errorMessage, { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}