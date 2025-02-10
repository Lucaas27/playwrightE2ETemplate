import logger from '@/utils/loggerconfig';
import { Connection, ConnectionConfiguration, Request } from 'tedious';

interface SQLConnectionObject {
  useSQL: boolean;
  db: ConnectionConfiguration;
}

export const connDataSQL: SQLConnectionObject = {
  useSQL: false,
  db: {
    server: process.env.SQL_SERVER,
    options: {
      database: process.env.SQL_DATABASE,
      instanceName: process.env.SQL_INSTANCE,
      encrypt: true,
      trustServerCertificate: true,
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.SQL_USERNAME,
        password: process.env.SQL_PASSWORD,
      },
    },
  },
};

export default class SQLClient {
  private token: ConnectionConfiguration;
  private connection: Connection;

  constructor() {
    this.token = connDataSQL.db;
  }

  async connect() {
    if (!this.token) {
      logger.error('No connection details provided, see @/config/SQLServer.ts "db" object');
      return null;
    }
    if (connDataSQL.useSQL) {
      return new Promise((resolve, reject) => {
        this.connection = new Connection(this.token);
        this.connection.connect((err) => {
          if (err) {
            this.connection.close();
            reject(err);
          }
          resolve(this);
        });
      });
    } else {
      logger.error('Use of SQL Server is turned off, see @/config/SQLServer.ts "useSQL" boolean');
      return null;
    }
  }

  async disconnect() {
    if (!this.connection) {
      logger.error('No active SQL connection to close');
      return null;
    }
    this.connection.close();
  }

  async select(query: string): Promise<String> {
    if (!this.connection) {
      throw new Error('No active SQL connection');
    }
    return new Promise((resolve, reject) => {
      const request = new Request(query, (err, _rowCount, _rows) => {
        if (err) {
          this.connection.close();
          reject(err);
        }
      });

      let newdata = [];

      request.on('row', (columns) => {
        columns.forEach(function (column: { value: any }) {
          newdata.push(column.value);
        });
      });

      request.on('requestCompleted', () => {
        this.connection.close();
        logger.info(`SELECT QUERY: ${query}\nSelect query returned with data: ${newdata.toString()}`);
        resolve(newdata.toString());
      });

      this.connection.execSql(request);
    });
  }

  async update(query: string) {
    if (!this.connection) {
      throw new Error('No active SQL connection');
    }
    return new Promise((resolve, reject) => {
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          this.connection.close();
          reject(err);
        }
        logger.info(`Row(s) updated: \n ${rowCount}`);
      });

      request.on('requestCompleted', () => {
        this.connection.close();
        logger.info(`Update query: ${query}\nUpdate complete`);
        resolve('Resolved');
      });

      this.connection.execSql(request);
    });
  }

  async delete(query: string) {
    if (!this.connection) {
      throw new Error('No active SQL connection');
    }
    return new Promise((resolve, reject) => {
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          this.connection.close();
          reject(err);
        }
        logger.info(`Row(s) deleted: \n${rowCount}`);
      });

      request.on('requestCompleted', () => {
        this.connection.close();
        logger.info(`Delete query: ${query}\nDelete complete`);
        resolve('Resolved');
      });

      this.connection.execSql(request);
    });
  }

  async insert(query: string) {
    if (!this.connection) {
      throw new Error('No active SQL connection');
    }
    return new Promise((resolve, reject) => {
      const request = new Request(query, (err, rowCount) => {
        if (err) {
          this.connection.close();
          reject(err);
        }
        logger.info(`Row(s) inserted: \n${rowCount}`);
      });

      request.on('requestCompleted', () => {
        this.connection.close();
        logger.info(`Insert query: ${query}\nInsert complete`);
        resolve('Resolved');
      });

      this.connection.execSql(request);
    });
  }
}
