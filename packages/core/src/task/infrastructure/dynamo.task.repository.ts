import { NotFoundException } from "#common/domain/exception";
import { Observe } from "#common/domain/services/observability";
import { TaskEntity } from "#task/domain/task.entity";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#task/domain/task.repository";
import { TaskMapper } from "./task.mapper";
import { TaskModel } from "./task.model";

export class DynamoTaskRepository implements TaskRepository {
  @Observe("repository")
  async findOne(id: string) {
    const task = await TaskModel.get({
      id,
    }).go();

    if (!task.data) throw new NotFoundException();

    return TaskMapper.fromPersistence(task.data);
  }

  @Observe("repository")
  async createOne(task: TaskEntity) {
    await TaskModel.create(TaskMapper.toPersistence(task)).go();
  }

  @Observe("repository")
  async list() {
    const tasks = await TaskModel.query.task({}).go();

    return tasks.data.map((task) => TaskMapper.fromPersistence(task));
  }
}

export const withDynamoTaskRepository = TaskRepositoryContext.with(
  new DynamoTaskRepository(),
);
