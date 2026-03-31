#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { MessagingStack } from '../lib/message-stack';
import { ComputeStack } from '../lib/compute-stack';
import { ApiStack } from '../lib/api-stack';

const app = new cdk.App();

const dbStack = new DatabaseStack(app, 'DatabaseStack');

const msgStack = new MessagingStack(app, 'MessagingStack');

const computeStack = new ComputeStack(app, 'ComputeStack', {
  table: dbStack.table,
  topic: msgStack.topic,
  queue: msgStack.queue
});

new ApiStack(app, 'ApiStack', {
  producer: computeStack.producer
});


