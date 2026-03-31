import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    print("FULL EVENT:", json.dumps(event)) 

    for record in event['Records']:
        print("RAW RECORD:", record)

        body = json.loads(record['body'])
        print("SQS BODY:", body)

        # Try extracting SNS message safely
        if 'Message' in body:
            message = json.loads(body['Message'])
        else:
            message = body  # fallback

        print("FINAL MESSAGE:", message)

        table.put_item(Item={
            "id": message.get("id", "fallback-id"),
            "data": message.get("data", {})
        })

    return {"status": "done"}