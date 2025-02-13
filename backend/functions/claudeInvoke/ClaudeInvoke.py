import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    """
    AWS Lambda function handler to process an incoming event, query multiple DynamoDB tables,
    and invoke a Bedrock model with the combined results.

    Args:
        event (dict): The event dictionary containing the input parameters. Must include a 'userQuery' key.
        context (object): The context in which the Lambda function is called.

    Returns:
        dict: A dictionary containing the status code and the response body. The body includes:
            - 'user_query': The query provided in the event.
            - 'dynamodb_data': The combined results from querying multiple DynamoDB tables.
            - 'bedrock_context': The response text from invoking the Bedrock model.

    Raises:
        ClientError: If there is an error querying any of the DynamoDB tables.
    """
    # Check if event has valid userQuery
    if not event or 'userQuery' not in event:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'No userQuery provided in event'})
        }

    dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
    bedrock_client = boto3.client("bedrock-runtime", region_name="us-east-1")

    model_id = "anthropic.claude-3-haiku-20240307-v1:0"
    user_query = event['userQuery']

    # List of DynamoDB table names to query
    tables_to_query = ["staffListTable", "ReportsTable", "tagListTable", "userTable"]
    combined_results = {}

    for table_name in tables_to_query:
        try:
            table = dynamodb.Table(table_name)
            response = table.scan()
            items = response.get("Items", [])
            combined_results[table_name] = items

            # Log table items to CloudWatch
            print(f"Dynamo results for table: {table_name}")
            print(f"Items: {json.dumps(items, indent=2)}")

        except ClientError as e:
            print(f"Error querying table {table_name}: {str(e)}")

    # Invoke Bedrock model with user_query and the combined DynamoDB data
    bedrock_response_text = invoke_bedrock_model(
        client=bedrock_client,
        model_id=model_id,
        prompt=user_query,
        dynamodb_data=combined_results
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "user_query": user_query,
            "dynamodb_data": combined_results,
            "bedrock_context": bedrock_response_text
        })
    }

def invoke_bedrock_model(client, model_id, prompt, dynamodb_data):
    """
    Invokes a Bedrock model with the provided prompt and DynamoDB data.
    
    Args:
        client (botocore.client.BedrockRuntime): The Bedrock Runtime client.
        model_id (str): The ID of the Bedrock model to invoke.
        prompt (str): The user query prompt.
        dynamodb_data (dict): The combined results from querying multiple DynamoDB tables.

    Returns:
        str: The response text from invoking the Bedrock model.
    """
    try:
        structured_prompt = f"""
        User Query: {prompt}
        
        Task: Please analyze the provided DynamoDB data to answer the query.
        
        Data: {json.dumps(dynamodb_data)}
        
        Please provide a structured analysis based on the user's query.
        """

        native_request = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 500,   # Maximum tokens to generate
            "temperature": 0.5,   # Lower temperature for more deterministic results
            "messages": [
                {
                    "role": "user", 
                    "content": structured_prompt
                }
            ]
        }

        response = client.invoke_model(
            modelId=model_id,
            body=json.dumps(native_request)
        )
        
        response_body = json.loads(response["body"].read())
        
        if isinstance(response_body, dict):
            if "content" in response_body and isinstance(response_body["content"], list):
                return response_body["content"][0].get("text", "No response text found")
            else:
                return response_body.get("completion", str(response_body))
        else:
            return str(response_body)
            
    except (ClientError, Exception) as e:
        return f"Error invoking Bedrock: {str(e)}"
