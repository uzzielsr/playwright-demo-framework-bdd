import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://magento.softwaretestingboard.com/');
        await this.page.click('a[href*="customer/account/login"]');
    }

    async login(email: string, password: string) {
        await this.page.fill('input#email', email);
        await this.page.fill('input#pass', password);
        await this.page.click('button#send2');
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector('h1.page-title span.base:has-text("Home Page")', { timeout: 5000 });
            await this.page.waitForSelector('span.logged-in', { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    async isErrorDisplayed(): Promise<boolean> {
        try {
            await this.page.waitForSelector('div.message-error div:has-text("The account sign-in was incorrect or your account is disabled temporarily.")', { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}