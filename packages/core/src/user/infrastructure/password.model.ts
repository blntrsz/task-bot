import { client } from "#common/infrastructure/clients/dynamodb.client";
import { Entity, EntityItem } from "electrodb";

export const PasswordModel = new Entity(
  {
    model: {
      entity: "password",
      version: "1",
      service: "user",
    },
    attributes: {
      user_id: {
        type: "string",
        required: true,
      },
      hash: {
        type: "string",
        required: true,
      },
      created_at: {
        type: "string",
        required: true,
      },
      updated_at: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      user: {
        pk: {
          field: "pk",
          composite: ["user_id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
    },
  },
  {
    table: process.env.TABLE_NAME,
    client,
  },
);

export type PasswordModel = EntityItem<typeof PasswordModel>;
