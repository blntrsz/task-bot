import { ValueObject } from "#common/domain/value-object";
import { z } from "zod";
import { randomUUID } from "crypto";

export const sessionSchema = z.object({
  session: z.string(),
  expireAt: z.date(),
  userId: z.string(),
  createdAt: z.date(),
});
export type SessionSchema = z.infer<typeof sessionSchema>;

function getExpirationDate() {
  const date = new Date();
  date.setHours(date.getHours() + 12);

  return date;
}

export class Session extends ValueObject<typeof sessionSchema> {
  schema = sessionSchema;

  static create(input: Pick<SessionSchema, "userId">) {
    const session = new Session({
      session: randomUUID(),
      createdAt: new Date(),
      expireAt: getExpirationDate(),
      userId: input.userId,
    });

    session.validate();

    return session;
  }

  isEqual(session: Session): boolean {
    return session.props.session === this.props.session;
  }
}
