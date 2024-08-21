import { handler } from "../src/services/spaces/handler";

// used to execute with ts-node {relative-path}
process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = "SpaceTable-12a0b0d80b73";

handler(
  {
    httpMethod: "POST",
    // queryStringParameters: {
    //   id: "da7a14c6-a194-4da1-91b4-b88d833ba0ba",
    // },
    body: JSON.stringify({
      location: "Germany",
    }),
  } as any,
  {} as any
);
