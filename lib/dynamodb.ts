import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { RemovalPolicy } from "@aws-cdk/core";
import { StreamViewType } from "@aws-cdk/aws-dynamodb";

export class DynamoDatabase extends cdk.Construct {
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(this, "OrderEventStore", {
      partitionKey: { name: "orderid", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "status", type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      stream: StreamViewType.NEW_IMAGE,
    });

    new cdk.CfnOutput(this, "OrderEventStoreTable", {
      exportName: "OrderEventStoreTableName",
      value: this.table.tableName,
    });

    new cdk.CfnOutput(this, "OrderEventStoreStream", {
      exportName: "OrderEventStoreStreamArn",
      value: this.table.tableStreamArn!,
    });
  }
}
