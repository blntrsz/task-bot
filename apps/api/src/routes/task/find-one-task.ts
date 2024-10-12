import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { TaskResponseSchema, TaskSchema } from "../../types/task.types";

const ResponseSchema = TaskResponseSchema;

export const findOneTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "get",
    tags: ["tasks"],
    request: {
      params: TaskSchema.pick({ id: true }),
    },
    responses: {
      200: {
        description: "Find One",
        content: Response(ResponseSchema),
      },
    },
  }),
  async (c) => {
    const param = c.req.valid("param");
    const task = await (TaskRepository.use() as TaskRepository).findOne(param);

    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      200,
    );
  },
);
