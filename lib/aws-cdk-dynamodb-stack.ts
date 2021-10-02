import * as cdk from "@aws-cdk/core";
import { DynamoDatabase } from "./dynamodb";

export class AwsCdkDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDatabase = new DynamoDatabase(this, "DynamoDatabaseConstruct");
    cdk.Tags.of(dynamoDatabase).add("Module", "DynamoDB");
  }
}
