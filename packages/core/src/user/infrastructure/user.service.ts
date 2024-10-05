import { Service } from "electrodb";
import { PasswordModel } from "./password.model";
import { UserModel } from "./user.model";
import { client } from "#common/infrastructure/clients/dynamodb.client";
import { SessionModel } from "./session.model";

export const UserService = new Service(
  {
    user: UserModel,
    password: PasswordModel,
    session: SessionModel,
  },
  {
    table: process.env.TABLE_NAME,
    client,
  },
);
