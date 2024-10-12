import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { TaskResponseSchema, TaskSchema } from "../../types/task.types";
import { addSegment } from "@task-bot/core/shared/domain/observability";

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
    using segment = addSegment("api", `${c.req.method} ${c.req.routePath}`);
    const param = c.req.valid("param");
    const task = await segment.try(() => TaskRepository.use().findOne(param));

    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      200,
    );
  },
);
