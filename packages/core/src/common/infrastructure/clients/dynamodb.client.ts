import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { captureAWSv3Client } from "aws-xray-sdk";

export const client = DynamoDBDocumentClient.from(
  // captureAWSv3Client(new DynamoDBClient({})),
  new DynamoDBClient({}),
);
