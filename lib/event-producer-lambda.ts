import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import { table } from "console";

interface OrderEventProducerLambdaProps {
  table: dynamodb.ITable;
}

export class OrderEventProducerLambda extends cdk.Construct {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: OrderEventProducerLambdaProps
  ) {
    super(scope, id);

    const boundary = iam.ManagedPolicy.fromManagedPolicyName(
      this,
      "Boundary",
      "RestrictedAccountAdmin"
    );

    const cloudwatchPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "CloudWatchFullAccess"
    );
    const dynamodbPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonDynamoDBFullAccess"
    );
    const role = new iam.Role(this, "OrderProducerRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [cloudwatchPolicy, dynamodbPolicy],
    });

    iam.PermissionsBoundary.of(role).apply(boundary);

    const lambdaFunction = new lambda.Function(this, "OrderProducer", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources/lambda"),
      handler: "eventstore-event-producer.handler",
      role: role,
      environment: {
        TABLE_NAME: props.table.tableName,
      },
    });
  }
}
