import { createContext } from "#common/context";
import { BaseRepository } from "#common/domain/base-repository";
import { SessionSchema } from "./session.value-object";
import { UserEntity, UserSchema } from "./user.entity";

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

export const UserRepositoryContext = createContext<UserRepository>();
export const useUserRepository = UserRepositoryContext.use;
