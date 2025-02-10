import { Fixtures, PlaywrightTestArgs } from '@playwright/test';
import { MockFunctions } from '@/utils/mock-functions';

export interface MyMocks {
  mockFunctions: MockFunctions;
}

export const myMocksFixtures: Fixtures<MyMocks, PlaywrightTestArgs> = {
  mockFunctions: async ({ page }, use) => {
    const mockFunctions = new MockFunctions(page);
    await use(mockFunctions);
  },
};
