import { fetchAuthSession, getCurrentUser, signIn, signOut } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { AuthStack } from "../../../../../space-finder/outputs.json";
import { awsRegion } from "../config/amplify";

import "../config/amplify";

interface AuthServiceProps {
  readonly username: string;
  readonly password: string;
}

export async function authLogin({ username, password }: AuthServiceProps) {
  let credentials = null;

  try {
    const signInOutput = await signIn({
      username,
      password,
      options: { authFlowType: "USER_PASSWORD_AUTH" },
    });

    if (signInOutput) {
      const session = await fetchAuthSession();
      const jwtToken = session.tokens?.idToken?.toString();
      if (jwtToken) {
        credentials = await generateTemporaryCredentials(jwtToken);
      }
    }
    return { credentials, signInOutput, username };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging in", error.message);
    }
  }
}

export async function authLogout() {
  try {
    await signOut();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error logging out", error.message);
    }
  }
}

export async function getAuthenticatedUser() {
  const data = await getCurrentUser();
  return data;
}

async function generateTemporaryCredentials(jwtToken: string) {
  const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
  const cognitoIdentity = new CognitoIdentityClient({
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: awsRegion },
      identityPoolId: AuthStack.SpaceItentityPoolId,
      logins: {
        [cognitoIdentityPool]: jwtToken,
      },
    }),
  });
  const credentials = await cognitoIdentity.config.credentials();
  return credentials;
}
