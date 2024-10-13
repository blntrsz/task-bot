import { useMutation } from "@tanstack/react-query";
import { taskKeys } from "./task";
import { api } from "@task-bot/ui/lib/api-client";

export enum TaskStatus {
  TO_DO = "to_do",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export async function updateTask(
  id: string,
  title?: string,
  description?: string,
  status?: TaskStatus,
) {
  const result = await api.tasks[":id"].$patch({
    param: {
      id,
    },
    json: {
      id,
      type: taskKeys.all[0],
      attributes: {
        title,
        description,
        status,
      },
    },
  });

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: updateTask,
  });
}
