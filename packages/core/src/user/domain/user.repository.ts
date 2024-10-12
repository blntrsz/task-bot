import { z } from "zod";
import { UserEntity, UserEntitySchema } from "./user.entity";
import { BaseRepository } from "@task-bot/core/shared/domain/base-repository";
import { objectToCamelCase } from "@task-bot/core/shared/infrastructure/util";
import { createContext } from "@task-bot/core/shared/contex";

export interface UserRepository extends BaseRepository<UserEntity> {
  findOne(props: Pick<UserEntitySchema, "id">): Promise<UserEntity>;
  findByEmail(props: Pick<UserEntitySchema, "email">): Promise<UserEntity>;
}

export const UserRepository = createContext<UserRepository>();

export const UserRepositoryQuerySchema = z.preprocess(
  objectToCamelCase,
  UserEntitySchema,
);
