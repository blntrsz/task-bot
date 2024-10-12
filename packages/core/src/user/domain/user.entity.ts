import { BaseEntity } from "@task-bot/core/shared/domain/base-entity";
import { randomUUID } from "crypto";
import { z } from "zod";
import { PasswordValueObject } from "./password.value-object";

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
    const props = this.props;
    return {
      id: props.id,
      type: "users" as const,
      attributes: {
        email: props.email,
        created_at: props.createdAt.toISOString(),
        updated_at: props.updatedAt.toISOString(),
      },
    };
  }
}
