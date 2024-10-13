import type { Route } from "@task-bot/api/src/type";
import { hc } from "hono/client";

export const api = hc<Route>("http://localhost:8787/", {
  init: {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  },
});
