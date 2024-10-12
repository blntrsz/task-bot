import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Response } from "../../lib/types";
import { TaskRepository } from "@task-bot/core/task/domain/task.repository";
import { TaskResponseSchema } from "../../types/task.types";

export const listTasks = new OpenAPIHono().openapi(
  createRoute({
    path: "/tasks",
    method: "get",
    tags: ["tasks"],
    request: {
      query: z.object({
        "page[number]": z.coerce.number().min(1).default(1),
        "page[size]": z.coerce.number().min(1).default(10),
      }),
    },
    responses: {
      200: {
        description: "List",
        content: Response(z.array(TaskResponseSchema)),
      },
    },
  }),
  async (c) => {
    const query = c.req.valid("query");
    const tasks = await (TaskRepository.use() as TaskRepository).list({
      pageNumber: query["page[number]"],
      pageSize: query["page[size]"],
    });

    const previousLinkQueryParam = new URLSearchParams();
    previousLinkQueryParam.set(
      "page[number]",
      String(query["page[number]"] - 1),
    );
    previousLinkQueryParam.set("page[size]", String(query["page[size]"]));
    const nextLinkQueryParam = new URLSearchParams();
    nextLinkQueryParam.set("page[number]", String(query["page[number]"] + 1));
    nextLinkQueryParam.set("page[size]", String(query["page[size]"]));

    return c.json({
      data: tasks.data.map((task) =>
        TaskResponseSchema.parse(task.toResponse()),
      ),
      links: {
        prev:
          tasks.pageNumber === 1
            ? null
            : `/tasks?${previousLinkQueryParam.toString()}`,
        next: tasks.hasNextPage
          ? `/tasks${nextLinkQueryParam.toString()}`
          : null,
      },
    });
  },
);
