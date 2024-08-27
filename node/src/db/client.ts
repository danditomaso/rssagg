import type pg from "pg";
import { Pool } from "pg";
import envVars from "../envVars";

class Database {
  private static instance: Database;
  private client: pg.Pool;

  private constructor() {
    this.client = new Pool({
      connectionString: envVars.DATABASE_URL,
    });

    this.client
      .connect()
      .then(() => console.info("Database connected successfully"))
      .catch((err) => console.error("Database connection error", err));
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): pg.Pool {
    return this.client;
  }
}

const dbInstance = Database.getInstance();
export const client = dbInstance.getClient();
