import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const {
  TESTRAIL_HOST,
  TESTRAIL_USER,
  TESTRAIL_API_KEY,
  TESTRAIL_PROJECT_ID,
  TESTRAIL_SUITE_ID,
} = process.env;

const BUILD_NUMBER = process.env.BUILD_NUMBER;

const reportPath = path.join(process.cwd(), 'reports', 'report.json');
const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

function getLatestScreenshotForScenario(scenarioName: string): string | null {
  const folder = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(folder)) return null;

  const baseName = scenarioName.replace(/\s+/g, '_').toLowerCase();

  const files = fs
    .readdirSync(folder)
    .filter((file) => file.startsWith(baseName))
    .map((file) => ({
      name: file,
      time: fs.statSync(path.join(folder, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? files[0].name : null;
}

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
      const statusText = status === 1 ? 'PASSED' : 'FAILED';
      const scenarioName = element.name;
      const baseName = scenarioName.replace(/\s+/g, '_').toLowerCase();

      let comment = `Automated result for: ${scenarioName}`;

      if (status === 5) {
        const failedStep = element.steps.find((s: any) => s.result.status === 'failed');
        if (failedStep?.result?.error_message) {
          comment += `\n\n❌ Error:\n${failedStep.result.error_message}`;
        }
      }

      const latestScreenshot = getLatestScreenshotForScenario(scenarioName);
      if (latestScreenshot) {
        const jenkinsLink = BUILD_NUMBER
          ? `http://localhost:8080/job/playwright-demo-framework-bdd/${BUILD_NUMBER}/artifact/screenshots/${latestScreenshot}`
          : `http://localhost:8080/job/playwright-demo-framework-bdd/lastSuccessfulBuild/artifact/screenshots/${latestScreenshot}`;

        comment += `\n\n🖼️ Screenshot: ${jenkinsLink}`;
      }

      console.log(`📤 Uploading result for C${caseId}: ${statusText} (${scenarioName})`);
      await addResultForCase(runId, caseId, status, comment);
    }
  }

  console.log(`✅ Results uploaded to TestRail (Test Run ID: ${runId})`);
})();