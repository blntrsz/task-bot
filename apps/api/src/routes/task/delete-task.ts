import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { DeleteTaskUseCase } from "@task-bot/core/task/use-case/delete-task.use-case";
import { TaskResponseSchema } from "../../types/task.types";
import { addSegment } from "@task-bot/core/shared/domain/observability";

const ResponseSchema = TaskResponseSchema.pick({ id: true, type: true });

export const deleteTask = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks/{id}",
    method: "delete",
    tags: ["tasks"],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Delete",
        content: Response(ResponseSchema),
      },
    },
  }),
  async (c) => {
    using segment = addSegment("api", `${c.req.method} ${c.req.routePath}`);
    const { id } = c.req.valid("param");

    const task = await segment.try(() =>
      new DeleteTaskUseCase().execute({
        id,
      }),
    );
    return c.json(
      {
        data: ResponseSchema.parse(task.toResponse()),
      },
      200,
    );
  },
);
