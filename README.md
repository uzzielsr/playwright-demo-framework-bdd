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
│   └── utils/                          # Utility functions and helpers (for future use)
│
├── screenshots/                        # Automatic screenshots per scenario
├── traces/                             # Playwright traces (only saved on failure)
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

## .gitignore Rules

```bash
node_modules/
test-results/
playwright-report/
blob-report/
playwright/.cache/
screenshots/
traces/
reports/
.env
```

---

## Credentials & Test Data

- Test credentials are hardcoded for demo purposes.
- In production use, credentials should be externalized into environment variables (`.env` files) and secured.

---

## Hooks Behavior

- `Before`: launches browser, context, page and tracing.
- `After`: captures screenshots, saves trace on failure, closes browser.

---

## Roadmap (Enterprise Expansion)

- TestRail Integration
- Allure Reporting
- Jenkins / GitHub Actions pipelines
- Parallel browser grid execution
- Cross-browser matrix
- API-based login optimization
- Secrets management
- Dockerized runners

---

## Sample Usage Summary

### Run full suite:

```bash
npm test
```

### Run by tag:

```bash
npm test -- --tags "@successful"
```

### View latest trace:

```bash
npx playwright show-trace traces/<scenario-name>.zip
```

---

## Author

Uzziel Sierra  
Senior QA Engineer — Playwright BDD Architect

---

This framework is production-ready for enterprise QA pipelines.