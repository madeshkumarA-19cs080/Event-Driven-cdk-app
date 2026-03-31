import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class MessagingStack extends cdk.Stack {
  public readonly topic: sns.Topic;
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, 'Eventtopic');

    const dlq = new sqs.Queue(this,'DLQ');

    this.queue = new sqs.Queue(this, 'MainQueue', {
       deadLetterQueue: {
        maxReceiveCount: 3,
        queue : dlq
       }
    });
    this.topic.addSubscription(new subs.SqsSubscription(this.queue));
  }
}