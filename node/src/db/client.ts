import pg from 'pg';
import envVars from '../envVars'

const { Client } = pg;

class Database {
  private static instance: Database;
  private client: pg.Client;

  private constructor() {
    this.client = new Client({
      connectionString: envVars.NODE_DB_URI
    });

    this.client.connect()
      .then(() => console.info('Database connected successfully'))
      .catch(err => console.error('Database connection error', err));
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): pg.Client {
    return this.client;
  }
}

const dbInstance = Database.getInstance();
export const client = dbInstance.getClient();