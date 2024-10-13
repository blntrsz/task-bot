import { serve } from "@hono/node-server";
import { app } from "./application";
import { dependencies, inject } from "./di";
import { config } from "dotenv";

config({ path: ".env" });

inject(dependencies, () => {
  serve({
    fetch: app.fetch,
    port: 8787,
  });
});
