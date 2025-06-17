import axios from 'axios';
import { testrailConfig } from './testrail.config';

const { host, user, apiKey, projectId, suiteId } = testrailConfig;

const auth = {
    username: user,
    password: apiKey,
};

export async function addTestRun(name: string) {
    const res = await axios.post(
        `${host}/index.php?/api/v2/add_run/${projectId}`,
        {
            suite_id: suiteId,
            name,
            include_all: true
        },
        { auth }
    );
    return res.data.id;
}

export async function addResultForCase(runId: number, caseId: number, statusId: number, comment = '') {
    await axios.post(
        `${host}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
        { status_id: statusId, comment },
        { auth }
    );
}