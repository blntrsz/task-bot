import { z } from "zod";
import { TaskEntity, TaskEntitySchema } from "../task.entity";
import { randomUUID } from "node:crypto";

export namespace TaskDescriptionUpdatedDomainEvent {
  export const name = "TaskDescriptionUpdated:1";

  export const Schema = z
    .object({
      name: z.literal(name).default(name),
      data: z.object({
        previous: TaskEntitySchema,
        current: TaskEntitySchema,
      }),
      metadata: z.object({
        idempotencyKey: z.string().uuid(),
      }),
    })
    .brand<"DomainEvent">();
  export type Schema = z.infer<typeof Schema>;

  export function create(task: TaskEntity): Schema {
    const previous = task.previous?.props;
    if (!previous) throw new Error("TODO");

    return Schema.parse({
      name,
      data: {
        previous,
        current: task.props,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    } as Schema);
  }
}
