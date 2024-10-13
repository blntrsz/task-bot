import {
  LoggerContext,
  MetricsContext,
  TracerContext,
} from "@task-bot/core/shared/domain/observability";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const SERVICE_NAME = "TaskBot";

const logger = new Logger({ serviceName: SERVICE_NAME, environment: "dev" });
const tracer = new Tracer({ serviceName: SERVICE_NAME });
const metrics = new Metrics({
  serviceName: SERVICE_NAME,
  namespace: SERVICE_NAME,
});

export const withLoggerContext = LoggerContext.with(logger);
export const withTracerContext = TracerContext.with(tracer);
export const withMetricsContext = MetricsContext.with(metrics);
