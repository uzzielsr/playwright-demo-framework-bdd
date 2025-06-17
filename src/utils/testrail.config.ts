import dotenv from 'dotenv';
dotenv.config();

export const testrailConfig = {
    host: process.env.TESTRAIL_HOST || '',
    user: process.env.TESTRAIL_USER || '',
    apiKey: process.env.TESTRAIL_API_KEY || '',
    projectId: Number(process.env.TESTRAIL_PROJECT_ID || 0),
    suiteId: Number(process.env.TESTRAIL_SUITE_ID || 0),
};