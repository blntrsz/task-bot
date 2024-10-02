import { Task } from "../domain/task.entity";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "../domain/task.repository";
import { Entity, EntityItem } from "electrodb";
import { Err, Ok } from "../../common/result";
import { NotFoundError } from "../../common/domain-error";
import { TaskMapper } from "../mapper/task.mapper";
import { client } from "../../common/dynamodb";
import { createSegment } from "../../common/observability";

const TaskEntity = new Entity(
  {
    model: {
      entity: "task",
      version: "1",
      service: "task-bot",
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

export type TaskEntity = EntityItem<typeof TaskEntity>;

export class DynamoTaskRepository implements TaskRepository {
  async findOne(id: string) {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      const task = await TaskEntity.get({
        id,
      }).go();

      if (!task.data) return Err(new NotFoundError());

      return Ok(TaskMapper.fromPersistence(task.data));
    });
  }

  async createOne(task: Task) {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      await TaskEntity.create(TaskMapper.toPersistence(task)).go();
    });
  }

  async list() {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      const tasks = await TaskEntity.query.task({}).go();

      return Ok(tasks.data.map((task) => TaskMapper.fromPersistence(task)));
    });
  }
}

export const withDynamoTaskRepository = TaskRepositoryContext.with(
  new DynamoTaskRepository(),
);
