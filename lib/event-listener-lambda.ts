import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import { DynamoEventSource } from "@aws-cdk/aws-lambda-event-sources";

interface OrderEventListnerLambdaProps {
  table: dynamodb.ITable;
}

export class OrderEventListnerLambda extends cdk.Construct {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: OrderEventListnerLambdaProps
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
    const role = new iam.Role(this, "OrderEventHandlerRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [cloudwatchPolicy],
    });

    iam.PermissionsBoundary.of(role).apply(boundary);

    const lambdaFunction = new lambda.Function(this, "OrderEventHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources/lambda"),
      handler: "eventstore-listener.handler",
      role: role,
    });

    const eventSource = new DynamoEventSource(props.table, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
    });
    lambdaFunction.addEventSource(eventSource);
  }
}
