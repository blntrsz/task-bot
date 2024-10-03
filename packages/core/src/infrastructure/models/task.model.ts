import { client } from "#infrastructure/common/dynamodb";
import { Entity, EntityItem } from "electrodb";

export const TaskModel = new Entity(
  {
    model: {
      entity: "task",
      version: "1",
      service: "task",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      name: {
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
      task: {
        pk: {
          field: "pk",
          composite: [],
        },
        sk: {
          field: "sk",
          composite: ["id"],
        },
      },
    },
  },
  {
    table: process.env.TABLE_NAME,
    client,
  },
);

export type TaskModel = EntityItem<typeof TaskModel>;
