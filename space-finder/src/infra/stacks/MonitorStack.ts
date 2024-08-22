import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, ComparisonOperator, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { EmailSubscription, LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";

export class MonitorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const snsLambdaAlarm = new NodejsFunction(this, "SnsLambdaAlarm", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "monitor", "handler.ts"),
    });

    const alarmTopic = new Topic(this, "AlarmTopic", {
      displayName: "AlarmTopic",
      topicName: "AlarmTopic",
    });

    alarmTopic.addSubscription(new EmailSubscription("sidney.e.s.s.jr@gmail.com"));

    // pode ser utilizado para configurar um webhook de comunicação entre aplicativos
    // alarmTopic.addSubscription(new LambdaSubscription(snsLambdaAlarm));

    const api4xxAlarm = new Alarm(this, "Api4xxAlarm", {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        period: Duration.minutes(1),
        statistic: "Sum",
        unit: Unit.COUNT,
        dimensionsMap: {
          ApiName: "SpacesApi",
        },
      }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmName: "Api4xxAlarm",
    });

    const topicAction = new SnsAction(alarmTopic);
    api4xxAlarm.addAlarmAction(topicAction);
    api4xxAlarm.addOkAction(topicAction);
  }
}
