import { test as setup } from '@/fixtures/index';

setup.describe('Auth', () => {
  setup('Team Leader can login successfully', async ({ loginPage }) => {
    await setup.step('GIVEN User visits the landing page', async () => {});

    await setup.step('WHEN User clicks the login button', async () => {});

    await setup.step('THEN User is redirected to the login page', async () => {
      await loginPage.elementsShouldBeVisible();
    });

    await setup.step('AND User can enter a username', async () => {
      await loginPage.usernameInput.type(process.env.USERNAME);
    });

    await setup.step('AND User can enter a password', async () => {
      await loginPage.passwordInput.type(process.env.PASSWORD);
    });

    await setup.step('AND User can click the continue button to login', async () => {
      await loginPage.continueButton.click();
    });

    await setup.step('AND User is redirected to the Opshub main page', async () => {});
  });

  setup('Admin user can login successfully', async ({ loginPage }) => {
    await setup.step('GIVEN User visits the landing page', async () => {});

    await setup.step('WHEN User clicks the login button', async () => {});

    await setup.step('THEN User is redirected to the login page', async () => {
      await loginPage.elementsShouldBeVisible();
    });

    await setup.step('AND User can enter a username', async () => {
      await loginPage.usernameInput.type(process.env.BASICACCESS_USERNAME);
    });

    await setup.step('AND User can enter a password', async () => {
      await loginPage.passwordInput.type(process.env.BASICACCESS_PASSWORD);
    });

    await setup.step('AND User can click the continue button to login', async () => {
      await loginPage.continueButton.click();
    });

    await setup.step('AND User is redirected to the Opshub main page', async () => {});
  });
});
