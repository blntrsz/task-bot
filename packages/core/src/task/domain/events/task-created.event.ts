import { z } from "zod";
import { TaskEntity, TaskEntitySchema } from "../task.entity";
import { randomUUID } from "node:crypto";

export namespace TaskCreatedDomainEvent {
  export const name = "TaskCreated:1";

  export const Schema = z
    .object({
      name: z.literal(name).default(name),
      data: z.object({
        current: TaskEntitySchema,
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
        current: task.props,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    } as Schema);
  }
}
