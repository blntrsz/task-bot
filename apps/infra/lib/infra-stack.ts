import * as cdk from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { SPADeploy } from "cdk-spa-deploy";
import { HttpApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { fn, api } = this.createApi();
    const table = this.createTable();
    // this.createSpa();

    fn.addEnvironment("TABLE_NAME", table.tableName);
    table.grantReadWriteData(fn);

    new cdk.CfnOutput(this, "api-url", {
      value: api.url ?? "",
    });
  }

  private createApi() {
    const fn = new NodejsFunction(this, "lambda", {
      entry: "../api/src/index.ts",
      tracing: Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(30),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      environment: {
        NODE_OPTIONS: "--enable-source-maps",
        DATABASE_URL: process.env.DATABASE_URL!,
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

    const api = new HttpApi(this, "api");

    api.addRoutes({
      path: "/{proxy+}",
      integration: new HttpLambdaIntegration("api-fn", fn),
    });

    return { fn, api };
  }

  private createTable() {
    const table = new Table(this, "table", {
      partitionKey: {
        name: "pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: "expired_at",
    });

    table.addGlobalSecondaryIndex({
      indexName: "gsi1pk-gsi1sk-index",
      partitionKey: {
        name: "gsi1pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "gsi1sk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    return table;
  }

  private createSpa() {
    return new SPADeploy(this, "cfDeploy").createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "../ui/dist",
    });
  }
}
