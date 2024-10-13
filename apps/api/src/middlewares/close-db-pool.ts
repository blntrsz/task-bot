import { DatabaseConnectionContext } from "@task-bot/core/shared/infrastructure/db-pool";
import { createMiddleware } from "hono/factory";
import type { DatabasePool } from "slonik";

export const closeDbPool = createMiddleware(async (_, next) => {
  await next();
  const dbPool = await DatabaseConnectionContext.use().get();

  await (dbPool as DatabasePool).end();
});
