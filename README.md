# Playwright Demo Framework BDD

Enterprise-grade end-to-end automation framework using **Playwright + TypeScript + Cucumber (BDD)**.

---

## Tech Stack

- Playwright
- TypeScript
- Cucumber (BDD)
- Page Object Model (POM)
- Hooks & World context
- Tracing (for failure debugging)
- Screenshots per scenario
- GitHub versioned
- Fully expandable to CI/CD enterprise pipelines

---

## Application Under Test

Magento Demo E-commerce site:

https://magento.softwaretestingboard.com/

---

## Project Structure

```bash
playwright-demo-framework-bdd/
│
├── src/                                # Test source code
│   ├── features/                       # Gherkin feature files (.feature) defining scenarios
│   ├── pages/                          # Page Object Model (POM) implementation
│   ├── steps/                          # Cucumber step definitions
│   ├── support/                        # Global hooks, Cucumber World configuration
│   ├── reporting/                      # Custom scripts for reporting (e.g., TestRail)
│   └── utils/                          # Utility functions and helpers (for future use)
│
├── screenshots/                        # Automatic screenshots per scenario
├── traces/                             # Playwright traces (only saved on failure)
├── reports/                            # Cucumber JSON reports (used for TestRail upload)
│
├── node_modules/                       # Node.js dependencies (ignored by Git)
├── .gitignore                          # Git ignore rules
├── package.json                        # Project dependencies and script definitions
├── tsconfig.json                       # TypeScript compiler options
└── README.md                           # Full project documentation (this file)
```

---

## System Prerequisites

- Node.js >= v18.x (tested with Node 22.x)
- NPM (comes bundled with Node.js)
- Git

---

## Initial Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/<your-github-username>/playwright-demo-framework-bdd.git
cd playwright-demo-framework-bdd
```

### Install Project Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npm run install:browsers
```

---

## How to Run the Tests

### Run all scenarios:

```bash
npm test
```

### Run specific scenario by tag:

```bash
npm test -- --tags "@successful"
npm test -- --tags "@invalid"
```

### Headless Mode (default is headless: true)

Modify in `src/support/hooks.ts`:

```typescript
browser = await chromium.launch({ headless: true });
```

---

## Output Artifacts

### Screenshots:

- Saved to: `/screenshots/`

### Traces (only for failed scenarios):

- Saved to: `/traces/`

### View traces:

```bash
npx playwright show-trace traces/<scenario-name>.zip
```

---

## ⚙️ Configuration Guide (TestRail + ImgBB + Environment)

### 1. 🧪 TestRail Setup

1. Create an account on [TestRail](https://www.gurock.com/testrail/) and log into your workspace.
2. Enable the API under `Administration > Site Settings > API > Enable API`.
3. Create a new 'Project' and inside it a 'Test Suite'.
4. Navigate to the project and copy the `project_id` and `suite_id` from the URL.
5. Create at least one test case (e.g., "Successful login") and copy its ID (`Cxxxx`).
6. Tag your Cucumber scenario with `@Cxxxx`.

### 2. 🖼️ ImgBB Setup

1. Create a free account at [ImgBB](https://imgbb.com).
2. Go to [ImgBB API Key](https://api.imgbb.com/) and copy your personal API Key.
3. This API allows uploading images and instantly getting a public link.

### 3. 🔐 Environment Variables (`.env`)

Create a `.env` file at the root of the project with the following variables:

```
TESTRAIL_HOST=https://<your-subdomain>.testrail.io
TESTRAIL_USER=your-email@example.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=your_project_id
TESTRAIL_SUITE_ID=your_suite_id
IMGBB_API_KEY=your-imgbb-api-key
```

This file is included in `.gitignore` for security.

### 4. 💡 Tips & Tricks

- You can manually test your ImgBB key using `curl`:
  ```bash
  curl -F "image=@screenshot.png" -F "key=YOUR_KEY" https://api.imgbb.com/1/upload
  ```
- If you don’t add the `IMGBB_API_KEY`, the framework will still work, but the TestRail comments will show a local fallback link instead of a public image.
- Use `npm run test:with-report` to run the tests and automatically upload the results to TestRail.

---

## TestRail Integration (Automatic Test Run Upload)

### ✅ Environment Variables

Create a `.env` file at the root with the following:

```
TESTRAIL_HOST=https://<your-subdomain>.testrail.io
TESTRAIL_USER=your-email@example.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=your_project_id
TESTRAIL_SUITE_ID=your_suite_id
IMGBB_API_KEY=your-imgbb-api-key
```

### 🧩 Dependencies

Make sure these are installed:

```bash
npm install dotenv ts-node axios
```

### 🧪 Run your Cucumber tests to generate the report:

```bash
npm test
```

### 🏷️ Tag each scenario with its corresponding TestRail Case ID:

```gherkin
@C2331
Scenario: Successful login
```

### ☁️ Upload results to TestRail:

```bash
npx ts-node src/reporting/testrail-reporter.ts
```

### 📸 Public Screenshot Upload

After each test run, the framework automatically uploads screenshots to [ImgBB](https://imgbb.com) and includes public URLs in TestRail comments.

✅ When using ImgBB, screenshots are uploaded to a public URL and work regardless of CI environment.

Make sure to add your `IMGBB_API_KEY` to the `.env` file to enable this feature.

### 🧵 One-liner command:

```bash
npm test && npx ts-node src/reporting/testrail-reporter.ts
```

---

### 🛠 Jenkins Integration (Optional)

You can run your tests automatically in Jenkins using a freestyle or pipeline job.

#### Prerequisites:
- Jenkins installed and accessible
- Git and Node.js installed on the Jenkins agent
- Environment variables configured in Jenkins or passed from a `.env` file

#### Example Steps for Jenkins Pipeline:
```groovy
pipeline {
  agent any
  environment {
    TESTRAIL_HOST = 'https://your-subdomain.testrail.io'
    TESTRAIL_USER = 'your-email@example.com'
    TESTRAIL_API_KEY = 'your-api-key'
    TESTRAIL_PROJECT_ID = 'your_project_id'
    TESTRAIL_SUITE_ID = 'your_suite_id'
    IMGBB_API_KEY = 'your-imgbb-api-key'
  }
  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/<your-github-username>/playwright-demo-framework-bdd.git'
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
        sh 'npm run install:browsers'
      }
    }
    stage('Run Tests') {
      steps {
        sh 'npm run test:with-report'
      }
    }
  }
}
```

🔁 **If you're not using ImgBB**, ensure Jenkins is publicly accessible (e.g., via a custom domain, VPN, or [ngrok](https://ngrok.com)) to allow TestRail to render screenshot links properly.

> 💡 **Note:** Jenkins screenshots are only visible in TestRail if Jenkins is reachable from the public web. Otherwise, prefer using ImgBB for reliable public URLs.