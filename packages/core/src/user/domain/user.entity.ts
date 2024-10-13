import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { randomUUID } from "crypto";
import { z } from "zod";
import { PasswordValueObject } from "./password.value-object";
import { entityToResponse } from "@task-bot/core/shared/domain/mapper";

export const Password = z.object({
  password: z.string().min(8),
});
export type Password = z.infer<typeof Password>;
export const UserEntitySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.instanceof(PasswordValueObject),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type UserEntitySchema = z.infer<typeof UserEntitySchema>;

export class UserEntity extends BaseEntity<typeof UserEntitySchema> {
  previous?: UserEntity;

  fork(toUpdate: Partial<UserEntitySchema>) {
    const entity = new UserEntity(
      {
        ...structuredClone(this.props),
        ...toUpdate,
        updatedAt: new Date(),
      },
      toUpdate,
    );
    entity.previous = this;

    return entity;
  }

  static create(props: Pick<UserEntitySchema, "email"> & Password) {
    const now = new Date();
    return new UserEntity({
      id: randomUUID(),
      email: props.email,
      password: PasswordValueObject.create({ password: props.password }),
      createdAt: now,
      updatedAt: now,
    });
  }

  toResponse() {
    return entityToResponse(this.props, "users");
  }
}
