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

1. Crea una cuenta en [TestRail](https://www.gurock.com/testrail/) y accede a tu espacio.
2. Activa la API desde `Administration > Site Settings > API > Enable API`.
3. Crea un nuevo "Project" y dentro de él un "Test Suite".
4. Navega al proyecto y copia el `project_id` y `suite_id` desde la URL.
5. Crea al menos un caso de prueba (e.g. "Successful login") y copia su ID (`Cxxxx`).
6. Etiqueta tu escenario de Cucumber con `@Cxxxx`.

### 2. 🖼️ ImgBB Setup

1. Crea una cuenta gratuita en [ImgBB](https://imgbb.com).
2. Ve a [ImgBB API Key](https://api.imgbb.com/) y copia tu API Key personal.
3. Esta API permite subir imágenes y obtener un link público al instante.

### 3. 🔐 Environment Variables (`.env`)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
TESTRAIL_HOST=https://<your-subdomain>.testrail.io
TESTRAIL_USER=your-email@example.com
TESTRAIL_API_KEY=your-api-key
TESTRAIL_PROJECT_ID=your_project_id
TESTRAIL_SUITE_ID=your_suite_id
IMGBB_API_KEY=your-imgbb-api-key
```

Este archivo está incluido en `.gitignore` por seguridad.

### 4. 💡 Tips

- Puedes probar tu clave de ImgBB manualmente con `curl`:
  ```bash
  curl -F "image=@screenshot.png" -F "key=YOUR_KEY" https://api.imgbb.com/1/upload
  ```
- Si no agregas la variable `IMGBB_API_KEY`, el framework aún funcionará, pero los comentarios en TestRail mostrarán un link local como fallback.
- Usa `npm run test:with-report` para ejecutar los tests y subir resultados automáticamente.

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