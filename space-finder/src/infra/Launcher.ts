import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { MonitorStack } from "./stacks/MonitorStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});
const authStack = new AuthStack(app, "AuthStack", { photosBucket: dataStack.photosBucket });
new ApiStack(app, "ApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
  userPool: authStack.getUserPool(),
});
new UiDeploymentStack(app, "UiDeploymentStack");
new MonitorStack(app, "MonitorStack");
