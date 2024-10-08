import { useObservability } from "@task-bot/core/common/domain/services/observability";
import { Context } from "hono";

export function createApi(c: Context) {
  return useObservability().createSegment(
    "path",
    `${c.req.method} ${c.req.routePath}`,
  );
}
