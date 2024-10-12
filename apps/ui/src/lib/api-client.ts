import type { Route } from "@task-bot/api/src/type";
import { hc } from "hono/client";

export const api = hc<Route>("");
