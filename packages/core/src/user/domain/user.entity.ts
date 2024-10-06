import { randomUUID } from "node:crypto";
import { BaseEntity } from "#common/domain/base-entity";
import { Password } from "./password.value-object";
import { UnauthorizedException } from "#common/domain/exception";
import { Session } from "./session.value-object";
import {
  UserDeletedDomainEvent,
  UserLoggedInDomainEvent,
  UserLoggedOutDomainEvent,
} from "./user.events";
import { UserSchema } from "@task-bot/shared/user.types";

type UserValueObjects = {
  password: Password;
  session?: Session;
};

export class UserEntity extends BaseEntity<typeof UserSchema> {
  schema = UserSchema;
  password: Password;
  session?: Session;

  constructor(props: UserSchema, valueObjects: UserValueObjects) {
    super({
      ...props,
      props,
    });
    this.password = valueObjects.password;
    this.session = valueObjects.session;
  }

  validate() {
    super.validate();
    this.password.validate();
    this.session?.validate();
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

  isLoggedIn() {
    if (!this.session) return false;
    return this.session.getProps().expireAt < new Date();
  }

  assertLoggedIn() {
    if (!this.isLoggedIn()) throw new UnauthorizedException();
  }

  login(password: string) {
    this.verifyPassword(password);

    this.session = Session.create({
      userId: this.id,
    });
    this.addEvent(new UserLoggedInDomainEvent(this));
  }

  logout() {
    this.session = undefined;
    this.addEvent(new UserLoggedOutDomainEvent(this));
  }

  delete() {
    this.addEvent(new UserDeletedDomainEvent(this));
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
      {
        password: Password.create({
          password: data.password,
          userId,
        }),
      },
    );

    user.validate();

    return user;
  }
}
