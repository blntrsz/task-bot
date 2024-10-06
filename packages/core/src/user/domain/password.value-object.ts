import { ValueObject } from "#common/domain/value-object";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PasswordSchema } from "@task-bot/shared/password.types";

export const createPasswordSchema = PasswordSchema.pick({
  userId: true,
}).extend({
  password: z.string().min(8),
});

export class Password extends ValueObject<typeof PasswordSchema> {
  schema = PasswordSchema;

  static create(data: z.infer<typeof createPasswordSchema>) {
    const now = new Date();
    const password = new Password({
      hash: bcrypt.hashSync(data.password, 10),
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    });

    password.validate();

    return password;
  }

  isEqual(password: Password): boolean {
    return (
      password.props.userId === this.props.userId &&
      password.props.hash === this.props.hash
    );
  }
}
