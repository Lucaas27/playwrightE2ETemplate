import { Fixtures } from '@playwright/test';
import { MyMocks } from '@/fixtures/mocks';
import { LoginPage } from '@/support/pages/login.page';
import { MainPage } from '@/support/pages/main.page';

export interface MyPages {
  loginPage: LoginPage;
  mainPage: MainPage;
}

export const myPagesFixtures: Fixtures<MyPages, MyMocks> = {
  loginPage: async ({ mockFunctions }, use) => {
    const page = new LoginPage(mockFunctions.page);
    await use(page);
  },
  mainPage: async ({ mockFunctions }, use) => {
    const page = new MainPage(mockFunctions.page);
    await use(page);
  },
};
