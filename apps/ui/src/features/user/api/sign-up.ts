import { useMutation } from "@tanstack/react-query";
import { userKeys } from "./user";
import { api } from "@task-bot/ui/lib/api-client";

async function signIn(attributes: { email: string; password: string }) {
  const result = await api.users.$post({
    json: {
      type: userKeys.all[0],
      attributes,
    },
  });

  if (!result.ok) throw result;
  const body = await result.json();

  return body;
}

export function useSignUp() {
  return useMutation({
    mutationFn: signIn,
  });
}
