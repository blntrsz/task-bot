import { z } from "@hono/zod-openapi";
import { TracerContext } from "@task-bot/core/shared/domain/observability";
import { createMiddleware } from "hono/factory";

export const remapZodErrorToJsonApi = createMiddleware(async (c, next) => {
  await next();
  const tracer = TracerContext.use();

  // if (c.res.status === 400) {
  //   const response = c.res.bodyUsed
  //     ? await c.res.json()
  //     : ((await c.res.json()) as z.SafeParseError<any>);
  //   if (response?.success === false) {
  //     console.log(response);
  //     const errors = response.error.issues.map((issue) => ({
  //       id: tracer.getRootXrayTraceId(),
  //       status: "400",
  //       source: { pointer: `/${issue.path.join("/")}` },
  //       title: "Validation Error",
  //       detail: issue.message,
  //     }));
  //     c.res = c.json({ errors }, 400);
  //   }
  // }
});
