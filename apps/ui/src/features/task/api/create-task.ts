import { api } from "#lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { taskKeys } from "./task-keys";
import { useTaskRepository } from "../infrastructure/api.task.repository";

export async function createTask(name: string) {
  const result = await api.tasks.$post({
    json: {
      type: taskKeys.all[0],
      attributes: {
        name: name,
      },
    },
  });

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useCreateTask() {
  const repository = useTaskRepository();
  return useMutation({
    mutationFn: repository.create,
  });
}
