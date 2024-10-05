import { ValueObject } from "#common/domain/value-object";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const passwordSchema = z.object({
  userId: z.string(),
  hash: z.string(),
});
export type PasswordSchema = z.infer<typeof passwordSchema>;

const createSchema = passwordSchema.pick({ userId: true }).extend({
  password: z.string().min(8),
});

export class Password extends ValueObject<typeof passwordSchema> {
  data: PasswordSchema;
  schema = passwordSchema;

  constructor(data: PasswordSchema) {
    super();
    this.data = data;
  }

  static create(data: z.infer<typeof createSchema>) {
    return new Password({
      hash: bcrypt.hashSync(data.password, 10),
      userId: data.userId,
    });
  }

  isEqual(password: Password): boolean {
    return (
      password.data.userId === this.data.userId &&
      password.data.hash === this.data.hash
    );
  }
}
