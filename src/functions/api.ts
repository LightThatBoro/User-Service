import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import ROUTES from '../routes'
import makeApi from '../utils/make-api'

export const api = makeApi('openapi.yaml', ROUTES)

export const handler = (event: APIGatewayProxyEvent, context: Context) => {
	/*
	By default, the callback waits until the runtime event loop is empty before freezing the process
	and returning the results to the caller. Setting this property to false requests that Lambda freeze
	the process soon after the callback is invoked, even if there are events in the event loop.
	Lambda will freeze the process, any state data, and the events in the event loop.
	Any remaining events in the event loop are processed when the Lambda function is next invoked,
	if AWS Lambda chooses to use the frozen process.

	TL;DR: Suggested by Official MongoDB Docs
	 */
	context.callbackWaitsForEmptyEventLoop = false

	return 	api.handleRequest(
		{
			method: event.httpMethod,
			path: event.path,
			body: event.body,
			query: event.queryStringParameters as { [_: string]: string | string[] },
			headers: event.headers as { [_: string]: string | string[] },
		},
		event,
		context,
	)
}
