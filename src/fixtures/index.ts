import { MyDb, myDbFixtures } from '@/fixtures/database';
import { MyMocks, myMocksFixtures } from '@/fixtures/mocks';
import { MyPages, myPagesFixtures } from '@/fixtures/playwrightPages';
import { combineFixtures } from '@/utils/helpers';
import baseTest from '@playwright/test';

interface CombinedFixtures extends MyMocks, MyPages, MyDb {}

export const test = baseTest.extend<CombinedFixtures>(combineFixtures(myPagesFixtures, myMocksFixtures, myDbFixtures));
