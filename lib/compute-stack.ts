import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Lambda } from 'aws-cdk-lib/aws-ses-actions';

interface ComputeStackProps extends cdk.StackProps {
  table: Table;
  topic: Topic;
  queue: Queue;
}

export class ComputeStack extends cdk.Stack {
  public readonly producer: lambda.Function;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

// Producer Lambda
    this.producer = new lambda.Function(this, 'ProducerLambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'producer.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TOPIC_ARN: props.topic.topicArn
      }
    });

    props.topic.grantPublish(this.producer);

    // Consumer Lambda
    const consumer = new lambda.Function(this, 'ConsumerLambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'consumer.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: props.table.tableName
      }
    });

    props.table.grantWriteData(consumer);

    consumer.addEventSource(
      new lambdaEventSources.SqsEventSource(props.queue)
    );
  }
}
