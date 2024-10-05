import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { useContainer } from "../container";

export const OBSERVABILITY_DI_TOKEN = "observability-di-token";
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

export function Observe(key: "use-case" | "api-path" | "repository") {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const value = `${target.constructor.name}.${propertyKey}`;

    descriptor.value = function (...args: any[]) {
      const observability = useObservability();
      return observability.createSegment(
        key,
        value,
      )(() => {
        return originalMethod.apply(this, args);
      });
    };
    return descriptor;
  };
}

export const useObservability = () =>
  useContainer<Observability>(OBSERVABILITY_DI_TOKEN);
