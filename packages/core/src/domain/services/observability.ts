import { createContext } from "#common/context";
import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";

export type ObservabilityResources = Pick<
  Observability,
  "tracer" | "logger" | "metrics"
>;

export interface Observability {
  tracer: Tracer;
  logger: Logger;
  metrics: Metrics;

  setup(event: any, context: any): void;
  createSegment(
    key: string,
    value: string,
  ): <T>(cb: (resources: ObservabilityResources) => Promise<T>) => Promise<T>;
}

export const ObservabilityContext = createContext<Observability>();
export const useObservability = ObservabilityContext.use;
