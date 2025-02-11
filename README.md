<div align="center" id="top">
&#xa0;
</div>

<h1 align="center">Playwright E2E Template</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/lucaas27/playwrightE2ETemplate?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/lucaas27/playwrightE2ETemplate?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/lucaas27/playwrightE2ETemplate?color=56BEB8">

</p>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#sparkles-features">How it works</a> &#xa0; | &#xa0;
  <a href="https://github.com/lucaas27" target="_blank">Author</a>
</p>

<br>

## :dart: About

This project is a UI testing framework web applications. It uses Playwright for browser automation and Allure for reporting. The framework is designed to run tests locally and in CI environments, providing detailed reports and trace files for debugging.

## :white_check_mark: Requirements

- nodejs >= v20.18.0 (switch with nvm)
- VSCode / Any half decent IDE

## :checkered_flag: Starting

1. Clone the repository:

   ```sh
   git clone https://<USER_NAME>@<REPO_URL>.git
   cd [PROJECT_ROOT] folder
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Download browser binaries:

   ```sh
   npx playwright install
   ```

4. Update .env files in the [environments](/src/environments/) folder to run against different environments (QA/PROD in this case).
   &nbsp;

5. To run against QA:

   ```sh
   npx run test:qa
   ```

6. To run against PROD:

   ```sh
   npx run test:prod
   ```

## Running Individual Tests

- To run an individual test : `npx playwright test tests/<FOLDER_NAME>/<TEST_SPEC_FILE_NAME>.ts`

## Running in Debug Mode

- To run an individual test in debug mode : `PWDEBUG=console npx playwright test tests/<FOLDER_NAME>/<TEST_FILE_NAME>`
  (Note: On Windows, set PWDEBUG as an environment variable with a value of 1)

## :sparkles: How it works

### Project Structure

```sh
  .gitignore
  .vscode/
      settings.json
  docs/
      index.md
  Jenkinsfile
  package.json
  README.md
  src/
      pages/
          components/
          elements/
      tests/
```

### Key Directories and Files

- [`src/pages`](/src/support/pages/): Contains the page objects, components, and elements.
- [`src/tests`](/src/tests/): Contains the test specifications and setup files.
- [`playwright-report`](/playwright-report/): Contains Playwright trace files.
- [`test-results`](/test-results/): Stores trace files for failures.

### Pages, Components, and Elements

The framework follows the Page Object Model (POM) design pattern, which helps in organizing the code and making it reusable and maintainable.

#### Pages

Pages represent the different pages of the application. Each page class extends the [`BasePage`](/src/support/pages/base.page.ts) class and contains components and elements that are present on that page.

Example: [`UFPLSMainPage`](/src/support/pages/ufplsMain.page.ts)

```javascript
  export class MainPage extends BasePage {
    readonly navbar: OpshubNavbar = new OpshubNavbar(this.page);
    readonly searchBox = new SearchBox(this.page);
    readonly filters = new Filters(this.page);
    readonly refreshButton = new Button(this.page, '[data-testid="refreshResultsButton"]', 'Export Button');
    readonly exportButton = new Button(this.page, '[data-testid="exportCasesButton"]', 'Export Button');
    readonly table = new UFPLSTable(this.page, '[role="table"]', 'UFPLS Table');
    readonly pagination = new Pagination(this.page);

    constructor(public page: Page) {
      super(page);
    }
  }
```

#### Components

Components represent reusable parts of the UI that can be found on the page. Each component class extends the [`BaseComponent`](/src/support/pages/components/base.component.ts) class and contains elements that are part of that component.

Example: [`SearchBox`](/src/support/pages/components/UFPLS/searchBox.component.ts)

```javascript
export class SearchBox extends BaseComponent {
  readonly inputField = new Input(this.page, '[data-testid="searchQueryInput"]', 'Search Box');
  readonly searchButton = new Button(this.page, '[data-testid="searchQuerySubmit"]', 'Search Button');
  readonly searchBySelector = new Select(this.page, '[data-testid="fieldSelect"]', 'Search By Filter');

  constructor(public page: Page) {
    super(page);
  }

  async searchByInvestorId(text: string | number) {
    // Implementation
  }

  async searchByInvestorName(text: string) {
    // Implementation
  }

  async searchByAdviserFirm(text: string) {
    // Implementation
  }
}
```

#### Elements

Elements represent individual UI elements on the page, such as buttons, inputs, and links. Each element class extends the [`BaseElement`](/src/support/pages/elements/base.element.ts) class and provides methods to interact with the element.

Example: [`Button`](/src/support/pages/elements/button.element.ts)

```javascript
import { BaseElement } from '@/pages/elements/base.element';
import { Page } from '@playwright/test';

export class Button extends BaseElement {
  constructor(page: Page, locatorStr: string, name: string, hiddenByDefault?: boolean) {
    super(page, locatorStr, name, hiddenByDefault);
  }

  get typeOf(): string {
    return 'button';
  }
}
```

### Test Setup

Tests are written using Playwright's test runner and are located in the [`src/tests`](/src/tests/) directory. The tests use the page objects to interact with the application and perform assertions.

Example: [`auth.setup.ts`](/src/tests/auth/auth.setup.ts)

```javascript
import { test as setup } from '@/fixtures/index';

setup.describe('Auth', () => {
  setup('Team Leader can login successfully', async ({ landingPage, loginPage, opshubPage }) => {
    await setup.step('GIVEN User visits the landing page', async () => {
      await landingPage.visit('/');
      await landingPage.elementsShouldBeVisible();
    });

    await setup.step('WHEN User clicks the login button', async () => {
      await landingPage.loginButton.click();
    });

    await setup.step('THEN User is redirected to the login page', async () => {
      await loginPage.elementsShouldBeVisible();
    });

    await setup.step('AND User can enter a username', async () => {
      await loginPage.usernameInput.type(process.env.WS02_USERNAME);
    });

    await setup.step('AND User can enter a password', async () => {
      await loginPage.passwordInput.type(process.env.WS02_PASSWORD);
    });

    await setup.step('AND User can click the continue button to login', async () => {
      await loginPage.continueButton.click();
    });
  });
});
```

## Capabilities

- Locally and in CI I have enabled 3 retries in [playwright.config.ts](/playwright.config.ts), change it to 0/1 for fast feedback
- To disable headless change headless to false in [playwright.config.ts](/playwright.config.ts)
- To enable dev tool while running locally make below change in [playwright.config.ts](/playwright.config.ts)

```javascript
use: {
    headless: false,
    launchOptions:
    {
        devtools: true
    },
    ...devices['Desktop Chrome']
}
```

- To run against other browsers (firefox,webkit etc) uncomment under project array in [playwright.config.ts](/playwright.config.ts)
- I save trace file for failures under test-results folder and
  follow [Trace Viewer](https://playwright.dev/docs/trace-viewer) for information on how to use it

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API reference](https://playwright.dev/docs/api/class-playwright/)
- [Playwright Community showcase](https://playwright.dev/docs/showcase/)
- [Playwright Changelog](https://github.com/microsoft/playwright/releases)
- This project uses [DotEnv](https://www.npmjs.com/package/dotenv) to maintain environment variables
