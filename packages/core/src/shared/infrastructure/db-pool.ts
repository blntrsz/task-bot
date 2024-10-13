import { createFieldNameTransformationInterceptor } from "slonik-interceptor-field-name-transformation";
import { createContext } from "../contex";
import {
  createPool,
  Interceptor,
  QueryResultRow,
  SchemaValidationError,
  DatabaseConnection as SlonikDatabaseConnection,
} from "slonik";
import { createQueryLoggingInterceptor } from "slonik-interceptor-query-logging";

export class DatabaseConnection {
  private connection?: SlonikDatabaseConnection;

  constructor(conn?: SlonikDatabaseConnection) {
    this.connection = conn;
  }

  async get() {
    if (this.connection) return this.connection;

    const conn = await createPool(process.env.DATABASE_URL!, {
      interceptors: [
        createFieldNameTransformationInterceptor({
          format: "CAMEL_CASE",
        }),
        createQueryLoggingInterceptor(),
        createResultParserInterceptor(),
      ],
    });

    return conn;
  }
}

export const DatabaseConnectionContext = createContext<DatabaseConnection>();

export const withDatabaseConnection = DatabaseConnectionContext.with(
  new DatabaseConnection(),
);

function createResultParserInterceptor(): Interceptor {
  return {
    // If you are not going to transform results using Zod, then you should use `afterQueryExecution` instead.
    // Future versions of Zod will provide a more efficient parser when parsing without transformations.
    // You can even combine the two – use `afterQueryExecution` to validate results, and (conditionally)
    // transform results as needed in `transformRow`.
    transformRow: async (executionContext, actualQuery, row) => {
      const { resultParser } = executionContext;

      if (!resultParser) {
        return row;
      }

      const validationResult = await resultParser.safeParseAsync(row);

      if (!validationResult.success) {
        throw new SchemaValidationError(
          actualQuery,
          row,
          validationResult.error.issues,
        );
      }

      return validationResult.data as QueryResultRow;
    },
  };
}
