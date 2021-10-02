#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AwsCdkDynamodbStack } from '../lib/aws-cdk-dynamodb-stack';

const app = new cdk.App();
new AwsCdkDynamodbStack(app, 'AwsCdkDynamodbStack');
