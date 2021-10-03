import * as cdk from "@aws-cdk/core";
import { DynamoDatabase } from "./dynamodb";
import { OrderEventListnerLambda } from "./event-listener-lambda";
import { OrderEventProducerLambda } from "./event-producer-lambda";

export class AwsCdkDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoDatabase = new DynamoDatabase(this, "DynamoDatabaseConstruct");
    cdk.Tags.of(dynamoDatabase).add("Module", "DynamoDB");

    const orderEventListenerLambda = new OrderEventListnerLambda(
      this,
      "OrderEventListnerLambdaConstruct",
      { table: dynamoDatabase.table }
    );
    cdk.Tags.of(orderEventListenerLambda).add("Module", "Lambda");

    const orderEventProducerLambda = new OrderEventProducerLambda(
      this,
      "OrderEventProducerLambdaConstruct",
      { table: dynamoDatabase.table }
    );
    cdk.Tags.of(orderEventProducerLambda).add("Module", "Lambda");
  }
}
