import { test } from '@/fixtures';

test.describe('User can sort main page', () => {
  test.beforeEach(async ({ mainPage }) => {
    await test.step('GIVEN User is on the main page', async () => {
      await mainPage.visit('/inventory.html');
      await mainPage.elementsShouldBeVisible();
    });
  });

  test('User can sort by price low to high', async ({ mainPage }) => {
    await test.step('WHEN User sorts by price low to high', async () => {
      await mainPage.pageHeader.sortSelector.selectByValue('lohi');
      await mainPage.pageHeader.sortSelector.shouldHaveSelectedOption('Price (low to high)');
    });
  });

  test('User can sort by price high to low', async ({ mainPage }) => {
    await mainPage.pageHeader.sortSelector.selectByValue('hilo');
    await mainPage.pageHeader.sortSelector.shouldHaveSelectedOption('Price (high to low)');
  });

  test('User can sort by name A to Z', async ({ mainPage }) => {
    await mainPage.pageHeader.sortSelector.selectByValue('az');
    await mainPage.pageHeader.sortSelector.shouldHaveSelectedOption('Name (A to Z)');
  });

  test('User can sort by name Z to A', async ({ mainPage }) => {
    await mainPage.pageHeader.sortSelector.selectByValue('za');
    await mainPage.pageHeader.sortSelector.shouldHaveSelectedOption('Name (Z to A)');
  });
});
