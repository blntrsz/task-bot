import { OpenAPIHono, z } from "@hono/zod-openapi";
import { listTasks } from "./routes/task/list-tasks";
import { createTask } from "./routes/task/create-task";
import { findOneTask } from "./routes/task/find-one-task";
import { apiReference } from "@scalar/hono-api-reference";
import { deleteTask } from "./routes/task/delete-task";
import { createUser } from "./routes/user/create-user";
import { updateTask } from "./routes/task/update-task";
import { addCorrelationHeaders } from "./middlewares/add-correation-headers";
import { authenticate } from "./middlewares/authenticate";
import { loginUser } from "./routes/user/login-user";
import { cors } from "hono/cors";
import { closeDbPool } from "./middlewares/close-db-pool";
import {
  LoggerContext,
  TracerContext,
} from "@task-bot/core/shared/domain/observability";
import { ValidationException } from "@task-bot/core/shared/domain/exceptions/validation-exception";
import { exceptionCodesToStatusCode } from "./types/exception-code-to-status-code";
import { Exception } from "@task-bot/core/shared/domain/exceptions/exception";

export const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          ok: false,
          errors: result.error.message,
          source: "custom_error_handler",
        },
        422,
      );
    }
  },
});
app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});
app
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "TaskBot API",
    },
  })
  .get(
    "/ui",
    apiReference({
      spec: {
        url: "/doc",
      },
    }),
  );

app
  .use("*", addCorrelationHeaders)
  // .use("*", authenticate)
  .use("*", closeDbPool)
  .use("*", cors())
  .options("*", (c) => {
    return c.text("", 204);
  });

export const routes = app
  // task
  .route("/", listTasks)
  .route("/", createTask)
  .route("/", findOneTask)
  .route("/", deleteTask)
  .route("/", updateTask)

  // user
  .route("/", createUser)
  .route("/", loginUser);

app.onError(async (error, c) => {
  console.log({ error });
  const tracer = TracerContext.use();
  const logger = LoggerContext.use();
  const correlationId = tracer.getRootXrayTraceId();

  if ("getResponse" in error) {
    const response = error.getResponse();
    logger.error(await response.text());

    return response;
  }

  if (error instanceof z.ZodError) {
    const errors = error.issues.map((issue) => ({
      id: correlationId,
      status: "400",
      source: { pointer: `/${issue.path.join("/")}` },
      title: error.message,
      detail: issue.message,
    }));
    return c.json({ errors }, 400);
  }

  if (error instanceof ValidationException) {
    const status = exceptionCodesToStatusCode[error.code];
    const errors = error.issues.map((issue) => ({
      id: correlationId,
      status: status.toString(),
      source: { pointer: `/${issue.path.join("/")}` },
      title: error.message,
      detail: issue.message,
    }));
    return c.json({ errors }, status);
  }

  if (error instanceof Exception) {
    const status = exceptionCodesToStatusCode[error.code];
    return c.json(
      {
        errors: [
          {
            id: correlationId,
            status: status.toString(),
            title: error.message,
          },
        ],
      },
      status,
    );
  }

  logger.error({
    stack: error.stack,
    name: error.name,
    message: error.message,
    cause: error.cause,
  });
  tracer.addErrorAsMetadata(error);
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
