import json
import boto3
import os
import time

sns = boto3.client('sns')

def handler(event, context):
    body = json.loads(event['body'])

    message = {
        "id": str(int(time.time())),
        "data": body
    }

    sns.publish(
        TopicArn=os.environ['TOPIC_ARN'],
        Message=json.dumps(message)
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Event sent!"})
    }