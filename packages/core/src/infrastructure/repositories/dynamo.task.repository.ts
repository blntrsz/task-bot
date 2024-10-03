import { TaskEntity } from "#domain/entities/task.entity";
import { NotFoundException } from "#domain/exceptions/exception";
import {
  TaskRepository,
  TaskRepositoryContext,
} from "#domain/repositories/task.repository";
import { useObservability } from "#domain/services/observability";
import { TaskMapper } from "#infrastructure/mapper/task.mapper";
import { TaskModel } from "#infrastructure/models/task.model";

export class DynamoTaskRepository implements TaskRepository {
  async findOne(id: string) {
    return useObservability().createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      const task = await TaskModel.get({
        id,
      }).go();

      if (!task.data) throw new NotFoundException();

      return TaskMapper.fromPersistence(task.data);
    });
  }

  async createOne(task: TaskEntity) {
    return useObservability().createSegment(
      "repository",
      `${DynamoTaskRepository.name}/${this.findOne.name}`,
    )(async () => {
      await TaskModel.create(TaskMapper.toPersistence(task)).go();
    });
  }

  async list() {
    return useObservability().createSegment(
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
