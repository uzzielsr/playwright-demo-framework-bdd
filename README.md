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

## TestRail Integration (Automatic Test Run Upload)

### ✅ Environment Variables

Create a `.env` file at the root with the following:

```
TESTRAIL_HOST=https://<your-subdomain>.testrail.io
TESTRAIL_USER=your-email@example.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=your_project_id
TESTRAIL_SUITE_ID=your_suite_id
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

### 🧵 One-liner command:

```bash
npm test && npx ts-node src/reporting/testrail-reporter.ts
```

### ✅ Example Output:

```

```