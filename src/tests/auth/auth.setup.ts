import { test as setup } from '@/fixtures/index';

setup.describe('Auth', () => {
  setup('User can login successfully', async ({ loginPage, mainPage }) => {
    await setup.step('GIVEN User visits the landing page', async () => {
      await loginPage.visit('/');
      await loginPage.elementsShouldBeVisible();
    });

    await setup.step('WHEN User fills out the login form', async () => {
      await loginPage.loginForm.fillOutForm(process.env.APP_USERNAME, process.env.APP_PASSWORD);
    });

    await setup.step('AND User clicks the login button', async () => {
      await loginPage.loginForm.loginButton.click();
    });

    await setup.step('THEN User is redirected to the main page', async () => {
      await mainPage.elementsShouldBeVisible();
      await mainPage.page.context().storageState({ path: 'src/tests/auth/auth.json' });
    });
  });
});
