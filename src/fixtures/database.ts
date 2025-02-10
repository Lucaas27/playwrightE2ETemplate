import { Fixtures } from '@playwright/test';
import MongoDb, { MongoInstance } from '@/services/mongoClient';
import SQLClient from '@/services/SQLClient';

export interface MyDb {
  mongo: MongoInstance;
  sql: SQLClient;
}

export const myDbFixtures: Fixtures<MyDb> = {
  mongo: async ({}, use) => {
    MongoDb.setupConnection();
    const Mongo: MongoInstance = MongoDb.connect('benefitsUFPLS');
    await use(Mongo);
  },
  sql: async ({}, use) => {
    const SQL: SQLClient = new SQLClient();
    await SQL.connect();
    await use(SQL);
  },
};
