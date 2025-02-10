import { LocalisedMongoConnection, connData } from '@/config/mongo';
import logger from '@/utils/loggerconfig';

import {
  MongoClient,
  Db,
  InsertOneResult,
  FindOptions,
  DeleteOptions,
  InsertOneOptions,
  UpdateOptions,
  UpdateResult,
  DeleteResult,
  AggregateOptions,
  Filter,
  Document,
  UpdateFilter,
  WithId,
  FindOneAndUpdateOptions,
  InsertManyResult,
} from 'mongodb';

class ConnectionsMap {
  private connectionsMap: Map<string, MongoInstance> = new Map();

  setupConnection(dbName?: string, connectionObject?: LocalisedMongoConnection): ConnectionsMap {
    // Add all connections from connData.db
    for (const [name, connectionDetails] of Object.entries(connData.db)) {
      if (!this.connectionsMap.has(name)) {
        if (!connectionDetails) {
          throw new Error(
            `No connection details found for database: ${name}. \nPlease check the config file @/config/mongo.ts.`
          );
        }
        this.connectionsMap.set(name, new MongoInstance(connectionDetails));
      }
    }

    // Add the additional connection if provided
    if (dbName && connectionObject) {
      if (this.connectionsMap.has(dbName)) {
        throw new Error(`Connection to database '${dbName}' already exists. Use Mongo.connect('${dbName}') instead.`);
      }
      this.connectionsMap.set(dbName, new MongoInstance(connectionObject));
    }

    return this;
  }

  connect(dbName: string = Array.from(this.connectionsMap.keys())[0]): MongoInstance {
    if (this.connectionsMap.has(dbName)) {
      return this.connectionsMap.get(dbName);
    } else {
      throw new Error(
        `Connection to database '${dbName}' does not exist. \nUse Mongo.setupConnection() to initialize connections from the config file @/config/mongo.ts.\nYou can also use Mongo.setupConnection('${dbName}', <LocalisedConnection>) to add a new connection.`
      );
    }
  }
}

export class MongoInstance {
  private client: MongoClient;
  private database: Db;
  private token: LocalisedMongoConnection;
  private useDb: string;

  constructor(connection: LocalisedMongoConnection) {
    this.token = connection;
  }
  private async connect() {
    if (connData.useMongo) {
      try {
        this.client = await MongoClient.connect(this.token.mongoUrl, {
          connectTimeoutMS: this.token.connectionTimeout * 1000,
        });
        logger.info(`Connected to MongoDB database: ${this.token.databaseAuthenticate}`);
        return this.client;
      } catch (e) {
        logger.error(`MongoDB connection failed: ${e.message}`);
        return null;
      }
    } else {
      logger.error('Use of Mongo is turned off, see @/config/mongo.ts "useMongo" boolean');
      return null;
    }
  }

  async disconnect() {
    if (connData.useMongo) {
      if (this.client !== undefined) {
        await this.client.close();
        logger.info('Closed MongoDB connection');
      }
      this.useDb = undefined;
    }
  }

  db(dbName: string) {
    this.useDb = dbName;
    return this;
  }

  private async withDb() {
    if (!this.client) {
      await this.connect();
    }
    this.database = this.client.db(this.useDb || this.token.databaseAuthenticate);
    return this.database;
  }

  /**
   * Inserts a document into a MongoDB collection
   * @returns result: { ok: number; n: number; }
   */
  async insert(collectionName: string, document: object, options?: InsertOneOptions) {
    return (await this.withDb())
      .collection(collectionName)
      .insertOne(document, options)
      .then((res: InsertOneResult<Document>) => {
        logger.info(`Inserting a document...
                Collection: ${collectionName}
                Document: ${JSON.stringify(document)}${options ? JSON.stringify(options) : ''}
                Successful insertions: ${res.insertedId.toString()}`);
        return res;
      })
      .catch((err) => {
        logger.error(`There was a problem with insert request ${JSON.stringify(document)}`);
        throw new Error(`There was a problem with insert request ${err}`);
      });
  }

  /**
   * Inserts multiple documents into a specified collection.
   *
   * @param {string} collectionName - The name of the collection to insert documents into.
   * @param {object[]} documents - An array of documents to be inserted.
   * @param {InsertOneOptions} [options] - Optional settings for the insert operation.
   * @returns {Promise<InsertManyResult>} A promise that resolves to the result of the insert operation.
   * @throws {Error} Throws an error if the insert operation fails.
   */
  async insertMany(collectionName: string, documents: object[], options?: InsertOneOptions): Promise<InsertManyResult> {
    return (await this.withDb())
      .collection(collectionName)
      .insertMany(documents, options)
      .then((res) => {
        logger.info(`Inserted documents into collection: ${collectionName}`);
        return res;
      })
      .catch((err) => {
        logger.error(`There was a problem with insertMany request`);
        throw new Error(`There was a problem with insertMany request ${err}`);
      });
  }

  /**
   * Selects data from a MongoDB collection
   * @returns result of query
   */
  async readMany<T>(collectionName: string, query: object, options?: FindOptions): Promise<WithId<T>[]> {
    const cursor = (await this.withDb()).collection(collectionName).find(query, options);

    if (options && options.sort) {
      cursor.sort(options.sort);
    }

    return cursor
      .toArray()
      .then((res) => {
        logger.info(`Fetching documents...
                Collection: ${collectionName}
                Query ${JSON.stringify(query)} ${options ? JSON.stringify(options) : ''}`);
        return res as WithId<T>[];
      })
      .catch((err) => {
        logger.error(`There was a problem with query ${JSON.stringify(query)}`);
        throw new Error(`There was a problem with read request ${err}`);
      });
  }

  /**
   * Selects one document from a MongoDB collection
   * @returns result of type any data type dependant on query
   */
  async readOne<T>(collectionName: string, query: object, options?: FindOptions): Promise<WithId<T>> {
    return (await this.withDb())
      .collection(collectionName)
      .findOne(query, { ...options, readConcern: { level: 'majority' }, readPreference: 'primary', maxTimeMS: 10000 })
      .then((res) => {
        logger.info(`Fetching a document...
                Collection: ${collectionName}
                Query ${JSON.stringify(query)} ${options ? JSON.stringify(options) : ''}
                Result: ${JSON.stringify(res)}`);
        return res as WithId<T>;
      })
      .catch((err) => {
        logger.error(`There was a problem with query ${JSON.stringify(query)}`);
        throw new Error(`There was a problem with read request ${err}`);
      });
  }

  /**
   * Selects one document from a MongoDB collection and updates it
   * @returns result of update operation performed
   */
  async readOneAndUpdate<T>(
    collectionName: string,
    filter: Filter<Document>,
    updates: UpdateFilter<Document>,
    options?: FindOneAndUpdateOptions
  ): Promise<WithId<T>> {
    return (await this.withDb())
      .collection(collectionName)
      .findOneAndUpdate(filter, updates, {
        ...options,
        readConcern: { level: 'majority' },
        readPreference: 'primary',
        maxTimeMS: 10000,
        returnDocument: 'after',
      })
      .then((res) => {
        logger.info(`Fetching a document...
                Collection: ${collectionName}
                Query ${JSON.stringify(filter)} ${options ? JSON.stringify(options) : ''}
                Result: ${JSON.stringify(res)}`);
        return res as WithId<T>;
      })
      .catch((err) => {
        logger.error(`There was a problem with query ${JSON.stringify(filter)}`);
        throw new Error(`There was a problem with read request ${err}`);
      });
  }

  /**
   * Selects data from a MongoDB collection
   * @returns result of type any data type dependant on query
   */
  async aggregate(collectionName: string, pipeline: Document[], options?: AggregateOptions) {
    return (await this.withDb())
      .collection(collectionName)
      .aggregate(pipeline, options)
      .toArray()
      .then((categories) => {
        logger.info(`Running aggregate query...
                    Collection: ${collectionName}`);
        for (const category of categories) {
          logger.info(`result: ${JSON.stringify(category)}`);
        }
        return categories;
      })
      .catch((err) => {
        logger.error(`Aggregate query failed`);
        throw new Error(`Aggregate query failed: ${err}`);
      });
  }

  /**
   * Updates a document in a MongoDB collection. This includes amending or deleting a field
   * @returns result: { ok: number; n: number; nModified: number; }
   */
  async updateOne(
    collectionName: string,
    filter: Filter<Document>,
    update: Document[] | UpdateFilter<Document>,
    updateOptions?: UpdateOptions
  ) {
    return (await this.withDb())
      .collection(collectionName)
      .updateOne(filter, update, updateOptions)
      .then((res: UpdateResult) => {
        logger.info(`Updating a document...
                Collection: ${collectionName}
                Filter: ${JSON.stringify(filter)}
                Update operation: ${JSON.stringify(update)} ${updateOptions ? JSON.stringify(updateOptions) : ''}.
                Successful updates: ${res.modifiedCount}`);
        return res;
      })
      .catch((err) => {
        throw new Error(`There was a problem with update request ${err}`);
      });
  }

  /**
   * Updates a document in a MongoDB collection. This includes amending or deleting a field
   * @returns result: { ok: number; n: number; nModified: number; }
   */
  async updateMany(
    collectionName: string,
    filter: Filter<Document>,
    update: Document[] | UpdateFilter<Document>,
    updateOptions?: UpdateOptions
  ) {
    return (await this.withDb())
      .collection(collectionName)
      .updateMany(filter, update)
      .then((res) => {
        logger.info(`Updating a document...
                Collection: ${collectionName}
                Filter: ${JSON.stringify(filter)}
                Update operation: ${JSON.stringify(update)} ${updateOptions ? JSON.stringify(updateOptions) : ''}.
                Successful updates: ${res.modifiedCount}`);
        return res;
      })
      .catch((err) => {
        logger.error(
          `There was a problem with update request ${JSON.stringify(filter)} ${JSON.stringify(update)}
            `
        );
        throw new Error(`There was a problem with update request ${err}`);
      });
  }

  /**
   * Deletes a document in a MongoDB collection
   * @returns result: { ok?: number; n?: number; }
   */
  async delete(collectionName: string, filter: Filter<Document>, deleteOptions?: DeleteOptions): Promise<DeleteResult> {
    return (await this.withDb())
      .collection(collectionName)
      .deleteOne(filter, deleteOptions)
      .then((res: DeleteResult) => {
        logger.info(`Deleting a document...
                Collection: ${collectionName}
                Filter: ${JSON.stringify(filter)}${deleteOptions ? JSON.stringify(deleteOptions) : ''}
                Successful deletions: ${res.deletedCount}`);
        return res;
      })
      .catch((err) => {
        logger.error(
          `There was a problem with delete request ${JSON.stringify(filter)}
            `
        );
        throw new Error(`There was a problem with delete request ${err}`);
      });
  }

  /**
   * Deletes documents in a MongoDB collection
   * @returns result: { ok?: number; n?: number; }
   */
  async deleteMany(
    collectionName: string,
    filter: Filter<Document>,
    deleteOptions?: DeleteOptions
  ): Promise<DeleteResult> {
    return (await this.withDb())
      .collection(collectionName)
      .deleteMany(filter, deleteOptions)
      .then((res: DeleteResult) => {
        logger.info(`Deleting documents...
                Collection: ${collectionName}
                Filter: ${JSON.stringify(filter)}${deleteOptions ? JSON.stringify(deleteOptions) : ''}
                Successful deletions: ${res.deletedCount}`);
        return res;
      })
      .catch((err) => {
        logger.error(
          `There was a problem with delete request ${JSON.stringify(filter)}
            `
        );
        throw new Error(`There was a problem with delete request ${err}`);
      });
  }
}

const MongoDb = new ConnectionsMap();
export default MongoDb;
