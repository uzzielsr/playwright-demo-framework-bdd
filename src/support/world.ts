import dotenv from 'dotenv';
dotenv.config();

import { IWorldOptions, setWorldConstructor, World as CucumberWorld } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';

export class World extends CucumberWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(World);