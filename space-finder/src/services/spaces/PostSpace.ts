import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { SpaceEntry } from "../model/Model";
import { validateAsSpaceEntry } from "../common/Validator";
import { createRandomId, parseJson } from "../common/Utils";

export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbCliente: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = createRandomId();
  const item: SpaceEntry = parseJson(event.body);
  item.id = randomId;

  validateAsSpaceEntry(item);

  const result = await ddbCliente.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    })
  );
  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
