import { api } from "#lib/api-client";
import { useMutation } from "@tanstack/react-query";

export async function createTask(name: string) {
  const result = await api.tasks.$post({
    json: {
      type: "tasks",
      attributes: {
        name: name,
      },
    },
  });

  const body = await result.json();

  return body;
}

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
  });
}
