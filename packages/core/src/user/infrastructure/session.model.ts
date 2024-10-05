import { client } from "#common/infrastructure/clients/dynamodb.client";
import { Entity, EntityItem } from "electrodb";

export const SessionModel = new Entity(
  {
    model: {
      entity: "session",
      version: "1",
      service: "user",
    },
    attributes: {
      session: {
        type: "string",
        required: true,
      },
      user_id: {
        type: "string",
        required: true,
      },
      expire_at: {
        type: "string",
        required: true,
      },
      created_at: {
        type: "string",
        required: true,
      },
    },
    indexes: {
      session: {
        pk: {
          field: "pk",
          composite: ["user_id"],
        },
        sk: {
          field: "sk",
          composite: ["session"],
        },
      },
    },
  },
  {
    table: process.env.TABLE_NAME,
    client,
  },
);

export type SessionModel = EntityItem<typeof SessionModel>;
