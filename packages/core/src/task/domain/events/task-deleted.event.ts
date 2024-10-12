import { z } from "zod";
import { TaskEntity, TaskEntitySchema } from "../task.entity";
import { randomUUID } from "node:crypto";

export namespace TaskDeletedDomainEvent {
  export const name = "TaskDeleted:1";

  export const Schema = z
    .object({
      name: z.literal(name).default(name),
      data: z.object({
        previous: TaskEntitySchema,
      }),
      metadata: z.object({
        idempotencyKey: z.string().uuid(),
      }),
    })
    .brand<"DomainEvent">();
  export type Schema = z.infer<typeof Schema>;

  export function create(task: TaskEntity): Schema {
    return Schema.parse({
      name,
      data: {
        previous: task.props,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    } as Schema);
  }
}
