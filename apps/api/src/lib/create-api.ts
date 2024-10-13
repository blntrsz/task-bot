import { addSegment } from "@task-bot/core/shared/domain/observability";
import { Context } from "hono";

export function addApiSegment(c: Context) {
  return addSegment("api", `${c.req.method} ${c.req.routePath}`);
}
