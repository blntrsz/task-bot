import { BaseRepository } from "#common/domain/base-repository";
import { useContainer } from "#common/domain/container";
import { SessionSchema } from "./session.value-object";
import { UserEntity, UserSchema } from "./user.entity";

export const USER_REPOSITORY_DI_TOKEN = "user-repository-di-token";
export interface UserRepository extends BaseRepository<UserEntity> {
  findOne(
    id: UserSchema["id"],
    session?: SessionSchema["session"],
  ): Promise<UserEntity>;
  findOneByEmail(email: UserSchema["email"]): Promise<UserEntity>;
  save(): Promise<void>;
  removeSession(
    id: UserSchema["id"],
    session: SessionSchema["session"],
  ): Promise<void>;
  remove(user: UserEntity): Promise<void>;
}

export const useUserRepository = () =>
  useContainer<UserRepository>(USER_REPOSITORY_DI_TOKEN);
