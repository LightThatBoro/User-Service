import { Context, SNSEvent } from "aws-lambda";
import { Logger } from "pino";
import MAIN_LOGGER from "./logger";

export default (
	handle: (event: string, data: any, identifier: string | undefined, logger: Logger) => Promise<void>
) => (
	async(event: SNSEvent, ctx: Context) => {
		const logger = MAIN_LOGGER.child({ requestId: ctx.awsRequestId });
		await Promise.all(
			event.Records.map(async({ Sns: { TopicArn, Message, MessageAttributes }  }) => {
				const [event] = TopicArn.split(":").slice(-1);
				logger.info({ event, data: Message.slice(0, 200) }, "received event");

				const data = JSON.parse(Message);
				const userId = MessageAttributes["userId"]?.Value || data?.userId;

				await handle(
					event,
					data,
					userId,
					logger.child({ userId })
				);
			})
		);
	}
);
