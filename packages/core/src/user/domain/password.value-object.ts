import { BaseValueObject } from "@task-bot/core/shared/domain/base-value-object";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const PasswordSchema = z.object({
  password: z.string().min(8),
});

export const PasswordValueObjectSchema = z.object({
  passwordHash: z.string(),
});

export class PasswordValueObject extends BaseValueObject<
  typeof PasswordValueObjectSchema
> {
  static create(props: z.infer<typeof PasswordSchema>) {
    return new PasswordValueObject({
      passwordHash: bcrypt.hashSync(props.password, 10),
    });
  }

  equals(password: PasswordValueObject) {
    return this.props.passwordHash === password.props.passwordHash;
  }
}
