import { createSegment } from "@task-bot/core/common/observability";
import { Context } from "hono";

export function createApi(c: Context) {
  return createSegment("path", `${c.req.method} ${c.req.routePath}`);
}
