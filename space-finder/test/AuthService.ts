import { fetchAuthSession, signIn, SignInOutput } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify } from "aws-amplify";

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_xHGj3mpIj",
      userPoolClientId: "3b4tddoj4idkqm1ge4dnbhqpcp",
      identityPoolId: "us-east-1:a95a644d-9b63-46d1-9f9e-277ecd5bf3cd",
    },
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const signInOutput: SignInOutput = await signIn({
      username: userName,
      password: password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    });
    return signInOutput;
  }

  //call only after login
  public async getIdToken() {
    const authSession = await fetchAuthSession();
    return authSession.tokens.idToken.toString();
  }

  public async generateTemporaryCredentials() {
    const idToken = await this.getIdToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_xHGj3mpIj`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "us-east-1:a95a644d-9b63-46d1-9f9e-277ecd5bf3cd",
        logins: {
          [cognitoIdentityPool]: idToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
