import { After, Before, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async function () {
    const isHeadless = process.env.HEADLESS !== 'false';
    browser = await chromium.launch({ headless: isHeadless });

    context = await browser.newContext();
    await context.tracing.start({ screenshots: true, snapshots: true });

    page = await context.newPage();
    this.page = page;
});

After(async function (scenario: ITestCaseHookParameter) {
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '_').toLowerCase();

    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }
    const screenshotPath = path.join(screenshotsDir, `${scenarioName}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const traceDir = path.join(process.cwd(), 'traces');
    if (!fs.existsSync(traceDir)) {
        fs.mkdirSync(traceDir);
    }
    if (scenario.result?.status === 'FAILED') {
        await context.tracing.stop({ path: path.join(traceDir, `${scenarioName}.zip`) });
    } else {
        await context.tracing.stop();
    }

    await context.close();
    await browser.close();
});