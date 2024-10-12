import { OpenAPIHono } from "@hono/zod-openapi";
import { listTasks } from "./routes/task/list-tasks";
import { createTask } from "./routes/task/create-task";
import { findOneTask } from "./routes/task/find-one-task";
import { apiReference } from "@scalar/hono-api-reference";
import { deleteTask } from "./routes/task/delete-task";
import { createUser } from "./routes/user/create-user";
import {
  LoggerContext,
  TracerContext,
} from "@task-bot/core/shared/domain/observability";
import { updateTask } from "./routes/task/update-task";

export const app = new OpenAPIHono();

app.use(async (c, next) => {
  const isCreateUserPath = c.req.path === "/users" && c.req.method === "POST";
  const isOpenApiPath = c.req.path === "/doc" && c.req.method === "GET";
  const isScalarPath = c.req.path === "/ui" && c.req.method === "GET";

  if (isCreateUserPath || isOpenApiPath || isScalarPath) {
    return next();
  }
  // const session = getCookie(c, "_session") ?? "";
  // const userId = getCookie(c, "_userid") ?? "";
  //
  // await new VerifyUserSessionUseCase().execute({
  //   session,
  //   id: userId,
  // });

  return next();
});

app.onError(async (error, c) => {
  const tracer = TracerContext.use();
  const logger = LoggerContext.use();

  if ("getResponse" in error) {
    const response = error.getResponse();
    logger.error(await response.text());

    return response;
  }

  // @ts-expect-error -- no traced type
  if (!error.traced) {
    tracer.addErrorAsMetadata(error);
    logger.error(error.message);
  }

  // if (error instanceof Exception) {
  //   const { json, status } = exceptionToResponse(error);
  //   return c.json(json, status as StatusCode);
  // }

  return c.json(
    {
      errors: [
        {
          id: tracer.getRootXrayTraceId(),
          message: error.message,
        },
      ],
    },
    500,
  );
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "TaskBot API",
  },
});
app.get(
  "/ui",
  apiReference({
    spec: {
      url: "/doc",
    },
  }),
);

export const routes = app
  // task
  .route("/", listTasks)
  .route("/", createTask)
  .route("/", findOneTask)
  .route("/", deleteTask)
  .route("/", updateTask)

  // user
  .route("/", createUser);
