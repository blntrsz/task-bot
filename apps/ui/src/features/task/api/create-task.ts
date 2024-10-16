import { useMutation } from "@tanstack/react-query";
import { taskKeys } from "./task";
import { api } from "@task-bot/ui/lib/api-client";

export async function createTask(attributes: { title: string, description: string }) {
  const result = await api.tasks.$post({
    json: {
      type: taskKeys.all[0],
      attributes,
    },
  });

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
  });
}
