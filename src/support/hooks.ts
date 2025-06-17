import { After, Before, ITestCaseHookParameter } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

let browser: Browser;
let context: BrowserContext;
let page: Page;
const printedFeatures = new Set<string>();

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
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
    await page.screenshot({ path: path.join(screenshotsDir, `${scenarioName}.png`), fullPage: true });

    const traceDir = path.join(process.cwd(), 'traces');
    if (!fs.existsSync(traceDir)) fs.mkdirSync(traceDir);
    if (scenario.result?.status === 'FAILED') {
        await context.tracing.stop({ path: path.join(traceDir, `${scenarioName}.zip`) });
    } else {
        await context.tracing.stop();
    }

    await context.close();
    await browser.close();

    const featurePath = scenario.pickle.uri ? path.resolve(scenario.pickle.uri) : '';
    let featureTitle = 'Unknown feature';

    if (featurePath && fs.existsSync(featurePath)) {
        const fileContent = fs.readFileSync(featurePath, 'utf-8');
        const match = fileContent.match(/Feature:\s*(.*)/);
        if (match) {
            featureTitle = match[1].trim();
        }
    }

    if (!printedFeatures.has(featureTitle)) {
        console.log(chalk.bold(`Feature: ${featureTitle}`));
        printedFeatures.add(featureTitle);
    }

    const testrailTag = scenario.pickle.tags?.find(tag => /^@C\d+$/.test(tag.name));
    if (testrailTag) {
        this.testRailCaseId = parseInt(testrailTag.name.substring(2), 10);
    }

    const status = scenario.result?.status?.toUpperCase() || 'UNKNOWN';
    const coloredStatus = status === 'PASSED' ? chalk.green(status) : chalk.red(status);
    console.log(`    Scenario: ${scenario.pickle.name} → ${coloredStatus}`);
});