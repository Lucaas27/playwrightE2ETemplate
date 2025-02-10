export interface LocalisedMongoConnection {
  mongoUrl: string;
  connectionTimeout: number;
  databaseAuthenticate: string;
  host: string;
}

interface MongoConnectionObject {
  useMongo: boolean;
  db: { [dbName: string]: LocalisedMongoConnection };
}

export const connData: MongoConnectionObject = {
  useMongo: true,
  db: {
    benefitsUFPLS: {
      mongoUrl: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
      host: `${process.env.MONGO_HOST}`,
      databaseAuthenticate: `${process.env.MONGO_DATABASE}`,
      connectionTimeout: 40,
    },
    etl_benefitsUFPLS: {
      mongoUrl: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
      host: `${process.env.MONGO_HOST}`,
      databaseAuthenticate: `${process.env.MONGO_ETL_DATABASE}`,
      connectionTimeout: 40,
    },
  },
};
