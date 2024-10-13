import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { CreateTaskUseCase } from "@task-bot/core/task/use-case/create-task.use-case";
import { CreateTaskSchema, TaskResponseSchema } from "../../types/task.types";
import { addApiSegment } from "../../lib/create-api";

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
    using segment = addApiSegment(c);
    const {
      attributes: { title, description },
    } = c.req.valid("json");

    const task = await segment.try(() =>
      new CreateTaskUseCase().execute({
        title,
        description,
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
