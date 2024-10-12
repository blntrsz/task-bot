import { z } from "zod";
import { UserEntity, UserEntitySchema } from "../user.entity";
import { randomUUID } from "node:crypto";

export namespace UserCreatedDomainEvent {
  export const name = "UserCreated:1";

  export const Schema = z
    .object({
      name: z.literal(name).default(name),
      data: z.object({
        current: UserEntitySchema.omit({ password: true }),
      }),
      metadata: z.object({
        idempotencyKey: z.string().uuid(),
      }),
    })
    .brand<"DomainEvent">();
  export type Schema = z.infer<typeof Schema>;

  export function create(task: UserEntity): Schema {
    return Schema.parse({
      name,
      data: {
        current: task.props,
      },
      metadata: {
        idempotencyKey: randomUUID(),
      },
    });
  }
}
