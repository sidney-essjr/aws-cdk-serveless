import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../common/Utils";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify("Not authorized!"),
    };
  }

  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];
    ddbClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`Deleted space with id ${spaceId}`),
    };
  }
  return {
    statusCode: 404,
    body: JSON.stringify("Please provide right args!"),
  };
}
