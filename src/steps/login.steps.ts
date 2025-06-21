import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { World } from '../support/world';

let loginPage: LoginPage;

Given('I am on the login page', async function (this: World) {
    loginPage = new LoginPage(this.page);
    await loginPage.navigate();
});

When('I enter valid credentials', async function (this: World) {
    await loginPage.loginWithValidCredentials();
});

When('I enter invalid credentials', async function (this: World) {
    await loginPage.loginWithInvalidCredentials();
});

Then('I should see that the user is logged in', async function () {
    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
});

Then('I should see an error message', async function () {
    const isVisible = await loginPage.isErrorDisplayed();
    expect(isVisible).toBeTruthy();
});