import { ValueObject } from "#common/domain/value-object";
import { randomUUID } from "crypto";
import { SessionSchema } from "@task-bot/shared/session.types";

function getExpirationDate() {
  const date = new Date();
  date.setHours(date.getHours() + 12);

  return date;
}

export class Session extends ValueObject<typeof SessionSchema> {
  schema = SessionSchema;

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
