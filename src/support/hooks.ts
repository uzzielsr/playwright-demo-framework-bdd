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
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const uniqueName = `${scenarioName}_${timestamp}`;

    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir);
    const screenshotFullPath = path.join(screenshotsDir, `${uniqueName}.png`);
    await page.screenshot({ path: screenshotFullPath, fullPage: true });

    this.screenshotFilename = `${uniqueName}.png`;

    const traceDir = path.join(process.cwd(), 'traces');
    if (!fs.existsSync(traceDir)) fs.mkdirSync(traceDir);
    const tracePath = path.join(traceDir, `${uniqueName}.zip`);

    if (scenario.result?.status === 'FAILED') {
        await context.tracing.stop({ path: tracePath });
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