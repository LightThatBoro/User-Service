import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { ACCOUNT_ID, AWS_REGION, SNS_TOPIC } from "../config.json";
import { Subscribers } from "../subscribers";

const options: { region: string, endpoint?: string } = { region: AWS_REGION };

if(process.env.IS_OFFLINE) {
	options.endpoint = "http://127.0.0.1:4002";
}

const client = new SNSClient(options);

export const publishMessage = async(message: Record<any, any>, attr: { userId: string, eventName: Subscribers }) => {
	const env = process.env.NODE_ENV;
	const accountId = env !== "production" ? "123456789012" : ACCOUNT_ID; // contains the test account id given by lambda

	const command = new PublishCommand({
		TopicArn: `arn:aws:sns:${ AWS_REGION }:${ accountId }:${ env }-${ SNS_TOPIC }`,
		MessageAttributes: {
			userId: { DataType: "string", StringValue: attr.userId },
			eventName: { DataType: "string", StringValue: attr.eventName } // the event name that other services use
		},
		Message: JSON.stringify(message)
	});

	await client.send(command);
};

