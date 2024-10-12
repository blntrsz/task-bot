import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";
import { Exception } from "./exceptions/exception";
import { createContext } from "../contex";
import { InternalServerException } from "./exceptions/internal-server-exception";

export const LoggerContext = createContext<Logger>();
export const TracerContext = createContext<Tracer>();
export const MetricsContext = createContext<Metrics>();

type ObservabilityResources = {
  logger: Logger;
  tracer: Tracer;
  metrics: Metrics;
};

export function addSegment(key: string, value: string) {
  const start = Date.now();
  const logger = LoggerContext.use();
  const tracer = TracerContext.use();
  const metrics = MetricsContext.use();

  const parentSegment = tracer.getSegment();
  const subSegment = parentSegment?.addNewSubsegment(value);
  subSegment && tracer.setSegment(subSegment);

  logger.appendKeys({
    [key]: value,
  });

  return {
    logger,
    tracer,
    metrics,
    try<T>(cb: () => Promise<T>) {
      try {
        return cb();
      } catch (error) {
        if (error instanceof Exception) {
          throw error;
        }

        tracer.addErrorAsMetadata(error as Error);

        throw new InternalServerException(error as any);
      }
    },
    [Symbol.dispose]: () => {
      metrics.addMetric(value, MetricUnit.Count, 1);

      metrics.addMetric(
        `${key}: ${value}`,
        MetricUnit.Milliseconds,
        Date.now() - start,
      );
      metrics.publishStoredMetrics();
      subSegment?.close();
      parentSegment && tracer.setSegment(parentSegment);
    },
  };
}

export function createSegment(key: string, value: string) {
  return async function <T>(
    cb: (resources: ObservabilityResources) => Promise<T>,
  ) {
    const start = Date.now();
    const logger = LoggerContext.use();
    const tracer = TracerContext.use();
    const metrics = MetricsContext.use();

    const parentSegment = tracer.getSegment();
    const subSegment = parentSegment?.addNewSubsegment(value);
    subSegment && tracer.setSegment(subSegment);

    logger.appendKeys({
      [key]: value,
    });

    try {
      const response = await cb({ tracer, logger, metrics });
      metrics.addMetric(value, MetricUnit.Count, 1);
      return response;
    } catch (error: any) {
      if (error.traced || error instanceof Exception) {
        throw error;
      }

      tracer.addErrorAsMetadata(error);
      logger.error(error);
      error.traced = true;

      throw error;
    } finally {
      metrics.addMetric(
        `${key}: ${value}`,
        MetricUnit.Milliseconds,
        Date.now() - start,
      );
      metrics.publishStoredMetrics();
      subSegment?.close();
      parentSegment && tracer.setSegment(parentSegment);
    }
  };
}

export function setupObservability(event: any, context: any) {
  const logger = LoggerContext.use();
  const metrics = MetricsContext.use();

  // logger setup
  logger.logEventIfEnabled(event);
  logger.addContext(context);

  // metrics setup
  metrics.captureColdStartMetric();
}
