import { serve } from "@hono/node-server";
import { app } from "./application";
import { dependencies, inject } from "./di";
import "dotenv/config";

inject(dependencies, () => {
  serve({
    fetch: app.fetch,
    port: 8787,
  });
});
