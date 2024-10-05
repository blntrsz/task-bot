import { ValueObject } from "#common/domain/value-object";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const passwordSchema = z.object({
  userId: z.string(),
  hash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PasswordSchema = z.infer<typeof passwordSchema>;

const createSchema = passwordSchema.pick({ userId: true }).extend({
  password: z.string().min(8),
});

export class Password extends ValueObject<typeof passwordSchema> {
  schema = passwordSchema;

  static create(data: z.infer<typeof createSchema>) {
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
