import { client } from "#common/infrastructure/clients/dynamodb.client";
import { Entity, EntityItem } from "electrodb";

export const UserModel = new Entity(
  {
    model: {
      entity: "user",
      version: "1",
      service: "user",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      email: {
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
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byEmail: {
        index: "gsi1pk-gsi1sk-index",
        pk: {
          field: "gsi1pk",
          composite: ["email"],
        },
        sk: {
          field: "gsi1sk",
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

export type UserModel = EntityItem<typeof UserModel>;
