import { OpenAPIHono } from "@hono/zod-openapi";
import { useObservability } from "@task-bot/core/common/observability";
import { swaggerUI } from "@hono/swagger-ui";
import { createTask } from "./routes/tasks/create-task";
import { findOneTask } from "./routes/tasks/find-one-task";
import { listTasks } from "./routes/tasks/list-tasks";

export const app = new OpenAPIHono();
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
  .route("/", createTask)
  .route("/", findOneTask)
  .route("/", listTasks);

export type Route = typeof routes;
