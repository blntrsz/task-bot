import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { TaskResponseSchema, UpdateTaskSchema } from "../../types/task.types";
import { UpdateTaskUseCase } from "@task-bot/core/task/use-case/update-task.use-case";
import { addApiSegment } from "../../lib/create-api";

const ResponseSchema = TaskResponseSchema;

export const updateTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "patch",
    tags: ["tasks"],
    request: {
      params: UpdateTaskSchema.pick({ id: true }),
      body: {
        content: {
          "application/json": {
            schema: UpdateTaskSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Update",
        content: Response(ResponseSchema),
      },
    },
  }),
  async (c) => {
    using segment = addApiSegment(c);
    const { id, attributes } = c.req.valid("json");

    const task = await segment.try(() =>
      new UpdateTaskUseCase().execute({ ...attributes, id }),
    );

    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      201,
    );
  },
);
