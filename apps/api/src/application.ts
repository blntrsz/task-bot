import { OpenAPIHono } from "@hono/zod-openapi";
import { StatusCode } from "hono/utils/http-status";
import {
  Exception,
  exceptionToResponse,
} from "@task-bot/core/common/domain/exception";
import { listTasks } from "./routes/task/list-tasks";
import { createTask } from "./routes/task/create-task";
import { findOneTask } from "./routes/task/find-one-task";
import { useObservability } from "@task-bot/core/common/domain/services/observability";
import { apiReference } from "@scalar/hono-api-reference";
import { deleteTask } from "./routes/task/delete-task";
import { createUser } from "./routes/user/create-user";
import { getCookie } from "hono/cookie";
import { VerifyUserSessionUseCase } from "@task-bot/core/user/use-cases/verify-user-session.use-case";

export const app = new OpenAPIHono();

app.use(async (c, next) => {
  const isCreateUserPath = c.req.path === "/users" && c.req.method === "POST";
  const isOpenApiPath = c.req.path === "/doc" && c.req.method === "GET";
  const isScalarPath = c.req.path === "/ui" && c.req.method === "GET";

  if (isCreateUserPath || isOpenApiPath || isScalarPath) {
    return next();
  }
  const session = getCookie(c, "_session") ?? "";
  const userId = getCookie(c, "_userid") ?? "";

  await new VerifyUserSessionUseCase().execute({
    session,
    id: userId,
  });

  return next();
});

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

  // user
  .route("/", createUser);
