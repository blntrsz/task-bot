import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { randomUUID } from "crypto";
import { z } from "zod";
import { UserEntitySchema } from "./user.entity";

export const SessionEntitySchema = z.object({
  id: z.string().uuid(),
  userId: UserEntitySchema.shape.id,
  createdAt: z.coerce.date(),
  expireAt: z.coerce.date(),
});
export type SessionEntitySchema = z.infer<typeof SessionEntitySchema>;

export class SessionEntity extends BaseEntity<typeof SessionEntitySchema> {
  static create(props: Pick<SessionEntitySchema, "userId">) {
    const now = new Date();
    return new SessionEntity({
      id: randomUUID(),
      userId: props.userId,
      createdAt: now,
      expireAt: getExpirationDate(now),
    });
  }
}

function getExpirationDate(now: Date) {
  const date = new Date(now);
  date.setHours(date.getHours() + 12);

  return date;
}
