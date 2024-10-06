import { UserEntity } from "#user/domain/user.entity";
import { Session } from "#user/domain/session.value-object";
import { UserModel } from "./user.model";
import { PasswordModel } from "./password.model";
import { SessionModel } from "./session.model";
import { Password } from "#user/domain/password.value-object";
import { UserResponseSchema } from "@task-bot/shared/user.types";

export namespace UserMapper {
  export function toPersistence(user: UserEntity): {
    user: UserModel;
    password?: PasswordModel;
    session?: SessionModel;
  } {
    const userProps = user.getProps();
    const passwordProps = user.password.getProps();
    const sessionProps = user.session?.getProps();

    return {
      user: {
        id: userProps.id,
        email: userProps.email,
        updated_at: userProps.updatedAt.toISOString(),
        created_at: userProps.createdAt.toISOString(),
      },
      password: {
        hash: passwordProps.hash,
        user_id: passwordProps.userId,
        created_at: passwordProps.createdAt.toISOString(),
        updated_at: passwordProps.updatedAt.toISOString(),
      },
      session: sessionProps
        ? {
            expire_at: sessionProps.expireAt.toISOString(),
            created_at: sessionProps.createdAt.toISOString(),
            user_id: sessionProps.userId,
            session: sessionProps.session,
          }
        : undefined,
    };
  }

  export function fromPersistence(
    user: UserModel,
    password: PasswordModel,
    session?: SessionModel | null,
  ): UserEntity {
    return new UserEntity(
      {
        id: user.id,
        email: user.email,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      },
      {
        password: new Password({
          userId: password.user_id,
          hash: password.hash,
          createdAt: new Date(password.created_at),
          updatedAt: new Date(password.updated_at),
        }),
        session: session
          ? new Session({
              userId: session.user_id,
              createdAt: new Date(session.created_at),
              session: session.session,
              expireAt: new Date(session.expire_at),
            })
          : undefined,
      },
    );
  }

  export function toResponse(user: UserEntity): UserResponseSchema {
    const props = user.getProps();
    return {
      id: props.id,
      type: "users",
      attributes: {
        email: props.email,
        session: user.session?.getProps().session,
        created_at: props.createdAt.toISOString(),
        updated_at: props.updatedAt.toISOString(),
      },
    };
  }
}
