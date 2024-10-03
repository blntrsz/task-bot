import { TaskEntity } from "../domain/task.entity";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "../domain/task.repository";
import { NotFoundError } from "../../common/domain-error";
import { TaskMapper } from "../mapper/task.mapper";
import { createSegment } from "../../common/observability";
import { TaskModel } from "./task.dynamo";

export class DynamoTaskRepository implements TaskRepository {
  async findOne(id: string) {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      const task = await TaskModel.get({
        id,
      }).go();

      if (!task.data) throw new NotFoundError();

      return TaskMapper.fromPersistence(task.data);
    });
  }

  async createOne(task: TaskEntity) {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      await TaskModel.create(TaskMapper.toPersistence(task)).go();
    });
  }

  async list() {
    return createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.list.name}`,
    )(async () => {
      const tasks = await TaskModel.query.task({}).go();

      return tasks.data.map((task) => TaskMapper.fromPersistence(task));
    });
  }
}

export const withDynamoTaskRepository = TaskRepositoryContext.with(
  new DynamoTaskRepository(),
);
