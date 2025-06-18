import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const {
    TESTRAIL_HOST,
    TESTRAIL_USER,
    TESTRAIL_API_KEY,
    TESTRAIL_PROJECT_ID,
    TESTRAIL_SUITE_ID,
} = process.env;

const reportPath = path.join(process.cwd(), 'reports', 'report.json');
const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

async function createTestRun(name: string): Promise<number> {
    const response = await axios.post(
        `${TESTRAIL_HOST}/index.php?/api/v2/add_run/${TESTRAIL_PROJECT_ID}`,
        {
            suite_id: TESTRAIL_SUITE_ID,
            name: name,
            include_all: true,
        },
        {
            auth: {
                username: TESTRAIL_USER!,
                password: TESTRAIL_API_KEY!,
            },
        }
    );
    return response.data.id;
}

async function addResultForCase(
    runId: number,
    caseId: number,
    statusId: number,
    comment: string
) {
    await axios.post(
        `${TESTRAIL_HOST}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
        {
            status_id: statusId,
            comment: comment,
        },
        {
            auth: {
                username: TESTRAIL_USER!,
                password: TESTRAIL_API_KEY!,
            },
        }
    );
}

(async () => {
    const runName = `Automated Run - ${new Date().toLocaleString()}`;
    const runId = await createTestRun(runName);

    for (const feature of reportData) {
        for (const element of feature.elements) {
            const tags = element.tags.map((t: any) => t.name);
            const caseTag = tags.find((t: string) => /^@C\d+/.test(t));

            if (!caseTag) continue;

            const caseId = parseInt(caseTag.replace('@C', ''), 10);
            const status = element.steps.every((s: any) => s.result.status === 'passed') ? 1 : 5;

            const name = element.name;
            const statusText = status === 1 ? 'PASSED' : 'FAILED';
            console.log(`📤 Uploading result for C${caseId}: ${statusText} (${name})`);

            // Ajuste para que coincida con el screenshot generado por hooks.ts
            const scenarioFilename = name.replace(/\s+/g, '_').toLowerCase();
            const screenshotFile = `screenshots/${scenarioFilename}.png`;
            const screenshotPath = path.join(process.cwd(), screenshotFile);

            let comment = `Automated result for: ${name}`;
            if (fs.existsSync(screenshotPath)) {
                const jenkinsURL = `http://localhost:8080/job/playwright-demo-framework-bdd/lastSuccessfulBuild/artifact/${screenshotFile}`;
                comment += `\nScreenshot: ${jenkinsURL}`;
            }

            await addResultForCase(runId, caseId, status, comment);
        }
    }

    console.log(`✅ Results uploaded to TestRail (Test Run ID: ${runId})`);
})();