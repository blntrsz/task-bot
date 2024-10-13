import { TracerContext } from "@task-bot/core/shared/domain/observability";
import { createMiddleware } from "hono/factory";

export const addCorrelationHeaders = createMiddleware(async (c, next) => {
  await next();
  const tracer = TracerContext.use();

  c.res.headers.set("x-correlation-id", tracer.getRootXrayTraceId() ?? "");
  c.res.headers.set("x-cold-start", String(tracer.getColdStart()) ?? "");
});
