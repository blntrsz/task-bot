import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  PasswordValueObject,
  PasswordValueObjectSchema,
} from "./password.value-object";
import { entityToResponse } from "@task-bot/core/shared/domain/mapper";

export const Password = z.object({
  password: z.string().min(8),
});
export type Password = z.infer<typeof Password>;
export const UserEntitySchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .merge(PasswordValueObjectSchema);
export type UserEntitySchema = z.infer<typeof UserEntitySchema>;

export class UserEntity extends BaseEntity<typeof UserEntitySchema> {
  previous?: UserEntity;
  password: PasswordValueObject;

  constructor(props: UserEntitySchema, updated?: Partial<UserEntitySchema>) {
    super(props, updated);
    this.password = new PasswordValueObject({
      passwordHash: props.passwordHash,
    });
  }

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
      passwordHash: PasswordValueObject.create({
        password: props.password,
      }).props.passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }

  toResponse() {
    return entityToResponse(this.props, "users");
  }
}
