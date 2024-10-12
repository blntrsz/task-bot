import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { CreateTaskUseCase } from "@task-bot/core/task/use-case/create-task.use-case";
import { CreateTaskSchema, TaskResponseSchema } from "../../types/task.types";
import { addSegment } from "@task-bot/core/shared/domain/observability";

const ResponseSchema = TaskResponseSchema;

export const createTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "post",
    tags: ["tasks"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateTaskSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Create",
        content: Response(ResponseSchema),
      },
    },
  }),
  async (c) => {
    using segment = addSegment("api", `${c.req.method} ${c.req.routePath}`);
    const {
      attributes: { title },
    } = c.req.valid("json");

    const task = await segment.try(() =>
      new CreateTaskUseCase().execute({
        title,
        description: "",
      }),
    );

    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      201,
    );
  },
);
