import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Function } from 'aws-cdk-lib/aws-lambda';

interface ApiStackProps extends cdk.StackProps {
  producer: Function;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, 'EventApi');

    const integration = new apigateway.LambdaIntegration(props.producer);

    api.root.addMethod('POST', integration);
  }
}
