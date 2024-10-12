import { api } from "#lib/api-client";
import { useMutation } from "@tanstack/react-query";

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
      type: "tasks",
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
