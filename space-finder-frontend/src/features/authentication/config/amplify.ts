import { Amplify } from "aws-amplify";
import { AuthStack } from "../../../../../space-finder/outputs.json";

export const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
      identityPoolId: AuthStack.SpaceItentityPoolId,
    },
  },
});
