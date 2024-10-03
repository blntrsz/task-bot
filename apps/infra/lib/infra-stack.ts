import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, "table", {
      partitionKey: {
        name: "pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    const fn = new NodejsFunction(this, "lambda", {
      entry: "../api/src/index.ts",
      tracing: Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(30),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        TABLE_NAME: table.tableName,
      },
      bundling: {
        sourceMap: true,
        commandHooks: {
          beforeInstall() {
            return [];
          },
          beforeBundling() {
            return [];
          },
          afterBundling(input, output) {
            return [`cp ${input}/package.json ${output}/package.json`];
          },
        },
      },
    });

    table.grantReadWriteData(fn);

    const api = new RestApi(this, "api", {
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true,
        dataTraceEnabled: true,
      },
    });
    const lambdaIntegration = new LambdaIntegration(fn);

    api.root.addResource("ui").addMethod("GET", lambdaIntegration);
    api.root.addResource("doc").addMethod("GET", lambdaIntegration);

    const tasks = api.root.addResource("tasks");
    tasks.addMethod("POST", lambdaIntegration);
    tasks.addMethod("GET", lambdaIntegration);

    const taskById = tasks.addResource("{proxy+}");
    taskById.addMethod("GET", lambdaIntegration);

    new cdk.CfnOutput(this, "api-url", {
      value: api.url,
    });
  }
}
