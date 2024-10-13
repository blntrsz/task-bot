import { OpenAPIHono, z } from "@hono/zod-openapi";
import { Exception } from "@task-bot/core/shared/domain/exceptions/exception";
import { ValidationException } from "@task-bot/core/shared/domain/exceptions/validation-exception";
import {
  LoggerContext,
  TracerContext,
} from "@task-bot/core/shared/domain/observability";
import { exceptionCodesToStatusCode } from "../types/exception-code-to-status-code";

export function handleError(app: OpenAPIHono) {
  app.onError(async (error, c) => {
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
}
