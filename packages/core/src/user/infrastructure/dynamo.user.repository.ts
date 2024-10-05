import { BaseRepository } from "#common/domain/base-repository";
import { NotFoundException } from "#common/domain/exception";
import { SessionSchema } from "#user/domain/session.value-object";
import { UserSchema, UserEntity } from "#user/domain/user.entity";
import { UserRepository } from "#user/domain/user.repository";
import { PasswordModel } from "./password.model";
import { SessionModel } from "./session.model";
import { UserMapper } from "./user.mapper";
import { UserModel } from "./user.model";
import { UserService } from "./user.service";

export class DynamoUserRepository
  extends BaseRepository<UserEntity>
  implements UserRepository
{
  async findOneByEmail(email: UserSchema["email"]): Promise<UserEntity> {
    const userResult = await UserModel.query
      .byEmail({
        email,
      })
      .go({
        limit: 1,
      });
    const user = userResult.data.at(0);

    if (!user) throw new NotFoundException();
    const passwordResult = await PasswordModel.get({
      user_id: user.id,
    }).go();
    const password = passwordResult.data;

    if (!password) throw new NotFoundException();

    return UserMapper.fromPersistence(user, password);
  }
  async save(): Promise<void> {
    await Promise.all(
      this.entities.map(async (entity) => {
        const data = UserMapper.toPersistence(entity);

        await UserService.transaction
          .write(({ user, password, session }) => {
            const tx = [user.upsert(data.user).commit()];
            if (data.password) {
              tx.push(password.upsert(data.password).commit());
            }
            if (data.session) {
              tx.push(session.upsert(data.session).commit());
            }

            return tx;
          })
          .go();
      }),
    );
  }
  async removeSession(
    id: UserSchema["id"],
    session: SessionSchema["session"],
  ): Promise<void> {
    await SessionModel.delete({
      session,
      user_id: id,
    }).go();
  }

  async remove(user: UserEntity): Promise<void> {
    const userId = user.getProps().id;
    const sessionId = user.session?.getProps().session;

    await UserService.transaction
      .write(({ user, password, session }) => {
        const tx = [
          user
            .delete({
              id: userId,
            })
            .commit(),

          password
            .delete({
              user_id: userId,
            })
            .commit(),
        ] as any[];

        if (sessionId) {
          tx.push(
            session
              .delete({
                user_id: userId,
                session: sessionId,
              })
              .commit(),
          );
        }

        return tx;
      })
      .go();
  }

  async findOne(
    id: UserSchema["id"],
    sessionId?: SessionSchema["session"],
  ): Promise<UserEntity> {
    const result = await UserService.transaction
      .get(({ user, password, session }) => {
        return [
          user
            .get({
              id,
            })
            .commit(),
          password
            .get({
              user_id: id,
            })
            .commit(),
          session
            .get({
              session: sessionId ?? "",
              user_id: id,
            })
            .commit(),
        ];
      })
      .go();
    const [user, password, session] = result.data;
    if (!user.item || !password.item) throw new NotFoundException();

    return UserMapper.fromPersistence(user.item, password.item, session?.item);
  }
}
