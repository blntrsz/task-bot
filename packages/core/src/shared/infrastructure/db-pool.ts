import { createContext } from "../contex";
import {
  createPool,
  DatabaseConnection as SlonikDatabaseConnection,
} from "slonik";

export class DatabaseConnection {
  private connection?: SlonikDatabaseConnection;

  constructor(conn?: SlonikDatabaseConnection) {
    this.connection = conn;
  }

  async get() {
    if (this.connection) return this.connection;

    const conn = await createPool("");

    return conn;
  }
}

export const DatabaseConnectionContext = createContext<DatabaseConnection>();

export const withDatabaseConnection = DatabaseConnectionContext.with(
  new DatabaseConnection(),
);
