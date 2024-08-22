import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { captureAWSv3Client, getSegment } from "aws-xray-sdk-core";
import { addCorsHeader } from "../common/Utils";
import { JsonError, MissingFieldError } from "../common/Validator";
import { deleteSpace } from "./DeleteSpace";
import { getSpaces } from "./GetSpaces";
import { postSpace } from "./PostSpace";
import { updateSpace } from "./UpdateSpace";

const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  const segment = getSegment().addNewSubsegment("testSegment");
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  segment.close();

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        response = getResponse;
        break;
      case "POST":
        const postResponse = await postSpace(event, ddbClient);
        response = postResponse;
        break;
      case "PUT":
        const putResponse = await updateSpace(event, ddbClient);
        response = putResponse;
        break;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        response = deleteResponse;
        break;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof MissingFieldError || JsonError) {
      return {
        statusCode: 400,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: error.message,
    };
  }
  addCorsHeader(response);
  return response;
}

export { handler };
