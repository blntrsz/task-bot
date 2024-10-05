import { z } from "zod";
import { randomUUID } from "node:crypto";
import { BaseEntity, baseEntitySchema } from "#common/domain/base-entity";
import { Password } from "./password.value-object";
import { UnauthorizedException } from "#common/domain/exception";

export const userSchema = baseEntitySchema.merge(
  z.object({
    email: z.string().email(),
  }),
);

export type UserSchema = z.infer<typeof userSchema>;

export class UserEntity extends BaseEntity<typeof userSchema> {
  schema = userSchema;
  password: Password;

  constructor(props: UserSchema, password: Password) {
    super({
      ...props,
      props,
    });
    this.password = password;
  }

  validate() {
    super.validate();
    this.password.validate();
  }

  verifyPassword(password: string) {
    const isEqual = this.password.isEqual(
      Password.create({
        password,
        userId: this.id,
      }),
    );

    if (!isEqual) throw new UnauthorizedException();
  }

  static create(data: Pick<UserSchema, "email"> & { password: string }) {
    const userId = randomUUID();
    const user = new UserEntity(
      {
        id: userId,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      Password.create({
        password: data.password,
        userId,
      }),
    );

    user.validate();

    return user;
  }
}
