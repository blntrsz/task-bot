import { UserEntity, UserEntitySchema } from "./user.entity";
import { BaseRepository } from "@task-bot/core/shared/domain/base-repository";
import { createContext } from "@task-bot/core/shared/contex";

export interface UserRepository extends BaseRepository<UserEntity> {
  findOne(props: Pick<UserEntitySchema, "id">): Promise<UserEntity>;
  findByEmail(props: Pick<UserEntitySchema, "email">): Promise<UserEntity>;
}

export const UserRepository = createContext<UserRepository>();
