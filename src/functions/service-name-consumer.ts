import { logger as MAIN_LOGGER } from "@frat/core";
import { Context, SNSEvent } from "aws-lambda";
import subscribers from "../subscribers";
import { ISubscriberParams } from "../types";
import getConnection from "../utils/get-connection";

export const handler = async(event: SNSEvent, ctx: Context) => {
	const logger = MAIN_LOGGER.child({ requestId: ctx.awsRequestId });
	const db = await getConnection();

	return await Promise.all(
		event.Records.map(async({
			Sns: {
				Message, MessageAttributes
			}
		}) => {
			const eventName = MessageAttributes["eventName"].Value;

			if(Object.keys(subscribers).includes(eventName)) {
				logger.info({ event, data: Message.slice(0, 200) }, "received event");

				const data = JSON.parse(Message);
				const userId = MessageAttributes["userId"].Value;

				// calls the subscriber mapping to the event
				await subscribers[eventName](<ISubscriberParams> { userId, data, db });
			}
		}
		)
	);
};
