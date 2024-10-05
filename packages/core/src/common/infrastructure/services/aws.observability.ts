import { Exception } from "#common/domain/exception";
import {
  Observability,
  ObservabilityResources,
  useObservability,
} from "#common/domain/services/observability";
import { Logger } from "@aws-lambda-powertools/logger";
import { MetricUnit, Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const SERVICE_NAME = "TaskBot";

const logger = new Logger({ serviceName: SERVICE_NAME });
const tracer = new Tracer({ serviceName: SERVICE_NAME });
const metrics = new Metrics({
  serviceName: SERVICE_NAME,
  namespace: SERVICE_NAME,
});

export class AwsObservability implements Observability {
  tracer = tracer;
  logger = logger;
  metrics = metrics;

  setup(event: any, context: any) {
    const { logger, metrics } = useObservability();

    // logger setup
    logger.logEventIfEnabled(event);
    logger.addContext(context);

    // metrics setup
    metrics.captureColdStartMetric();
  }

  createSegment(key: string, value: string) {
    return async function <T>(
      cb: (resources: ObservabilityResources) => Promise<T>,
    ) {
      const start = Date.now();
      const { tracer, logger, metrics } = useObservability();
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
}
