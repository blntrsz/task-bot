import { createContext } from "#common/context";
import { UserEntity, UserSchema } from "./user.entity";

export interface UserRepository {
  add(entity: UserEntity): void;
  popAll(): UserEntity[];

  findOne(id: string): Promise<UserEntity>;
  findOneByEmail(email: UserSchema["email"]): Promise<UserEntity>;
  save(): Promise<void>;
  list(): Promise<UserEntity[]>;
}

export const UserRepositoryContext = createContext<UserRepository>();
export const useUserRepository = UserRepositoryContext.use;
