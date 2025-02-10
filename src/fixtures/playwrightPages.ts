import { Fixtures } from '@playwright/test';
import { MyMocks } from '@/fixtures/mocks';
import { LoginPage } from '@/pages/login.page';

export interface MyPages {
  loginPage: LoginPage;
}

export const myPagesFixtures: Fixtures<MyPages, MyMocks> = {
  loginPage: async ({ mockFunctions }, use) => {
    const loginPage = new LoginPage(mockFunctions.page);
    await use(loginPage);
  },
};
