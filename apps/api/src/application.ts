import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { StatusCode } from "hono/utils/http-status";
import {
  Exception,
  exceptionToResponse,
} from "@task-bot/core/common/domain/exception";
import { listTasks } from "./routes/tasks/list-tasks";
import { createTask } from "./routes/tasks/create-task";
import { findOneTask } from "./routes/tasks/find-one-task";
import { useObservability } from "@task-bot/core/common/domain/services/observability";
// import { getCookie } from "hono/cookie";

export const app = new OpenAPIHono();

// app.use((c, next) => {
//   const yummyCookie = getCookie(c, "_session");
//   return next;
// });

app.onError(async (error, c) => {
  const { tracer, logger } = useObservability();
  const rootTraceId = tracer.getRootXrayTraceId();

  if ("getResponse" in error) {
    const response = error.getResponse();
    logger.error(await response.text());

    return response;
  }

  // @ts-expect-error -- traced does not exist on error
  if (!error.traced) {
    tracer.addErrorAsMetadata(error);
    logger.error(error.message);
  }

  if (error instanceof Exception) {
    const { json, status } = exceptionToResponse(error);
    return c.json(json, status as StatusCode);
  }

  return c.json(
    {
      errors: [
        {
          id: rootTraceId,
          message: error.message,
        },
      ],
    },
    500,
  );
});

app.get("/ui", swaggerUI({ url: "/doc" }));
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "TaskBot API",
  },
});

const routes = app
  .route("/", listTasks)
  .route("/", createTask)
  .route("/", findOneTask);

export type Route = typeof routes;
