import {
	APIResult,
	DEFAULT_AUTH_SCHEME,
	getAuthUser,
	getFullRequest,
	logAndReturn,
	LoggedInUserClaim,
	logger as MAIN_LOGGER,
	MissingParameters
} from "@frat/core";
import { Boom } from "@hapi/boom";
import { Context } from "aws-lambda";
import admin from "firebase-admin";
import OpenAPIBackend, { Handler as APIHandler } from "openapi-backend";
import { Logger } from "pino";
import { Connection, EntityNotFoundError } from "typeorm";
import { operations } from "../types/gen";
import { getFirebaseAdmin } from "./firebase";
import getConnection from "./get-connection";

/**
 * Main file with almost all the boilerplate required
 * for auth, wrapping a pure function into an HTTP controller etc.
 */
// get all operations from openAPI
export type Operation = keyof operations

// add missing parameters
// (not all operations have all these, so we add them)
type FullOp<O extends Operation> = operations[O] & MissingParameters;

export type AuthUser = admin.auth.DecodedIdToken & LoggedInUserClaim;

export type Authentication = { [DEFAULT_AUTH_SCHEME]: AuthUser }

// full request type of an operation -- query + parameters + requestBody
export type FullRequest<O extends Operation> =
    FullOp<O>["parameters"]["query"] &
    FullOp<O>["parameters"]["path"] &
    FullOp<O>["requestBody"]["content"]["application/json"]

// the response type of an operation
export type Response<O extends Operation> = FullOp<O>["responses"]["200"]["content"]["application/json"]

// handle cleaned up request (type checks response too)
export type Handler<O extends Operation> = (
    ev: FullRequest<O>,
    conn: { db: Connection },
    auth: Authentication,
    logger: Logger
) => Promise<Response<O>>

// backend agnostic wrapper
// makes a function work for serverless, express & others
function errorHandlingWrap<O extends Operation>(getHandler: () => Handler<O> | Promise<Handler<O>>): APIHandler {
	return async(e, req, ctx: Context) => {
		const logger = MAIN_LOGGER.child({ requestId: ctx?.awsRequestId || "unknown" });
		const result = {} as APIResult;

		const fullRequest = getFullRequest(e, req);

		let auth: Authentication | undefined = undefined;
		let trace: string | undefined = undefined;
		try {
			if(e.validation?.errors) {
				// noinspection ExceptionCaughtLocallyJS
				throw new Boom("Invalid request", { statusCode: 400, data: e.validation.errors });
			}

			// if auth failed
			if(e.security && !e.security.authorized && DEFAULT_AUTH_SCHEME in e.security) {
				// noinspection ExceptionCaughtLocallyJS
				throw e.security[DEFAULT_AUTH_SCHEME].error;
			}

			auth = e.security as Authentication;
			const handler = await getHandler();

			result.body = await handler(
				fullRequest,
				{ db: await getConnection() },
				auth,
				logger
			);

			result.statusCode = 200; //result.body ? 200 : 204

		} catch(error) {
			let errorDescription: string;
			let data: any;
			trace = error.stack;
			if(error instanceof Boom) {
				errorDescription = error.message;
				data = error.data;
				result.statusCode = error.output.statusCode;
			} else if(error instanceof EntityNotFoundError) {
				errorDescription = `Could not find "${ error.name }"`;
				result.statusCode = 404;
			} else {
				errorDescription = "Internal Server Error";
				result.statusCode = 500;
			}

			result.body = {
				error: errorDescription,
				statusCode: result.statusCode,
				message: error.message,
				data
			};
		}

		return logAndReturn(auth, result, fullRequest, trace, logger, e);
	};
}

export default (
	definition: string,
	routes: { [K in Operation]: () => Promise<Handler<K>> | Handler<K> }
) => {
	// create api with your definition file or object
	const api = new OpenAPIBackend({ definition, quick: process.env.NODE_ENV === "production" });

	api.registerSecurityHandler(DEFAULT_AUTH_SCHEME,
		async e => await getAuthUser<AuthUser>(e,
			getFirebaseAdmin(),
			Boom));

	api.register({
		notFound: errorHandlingWrap(() => {
			return async() => {
				throw new Boom("Not Found", { statusCode: 404 });
			};
		}),
		validationFail: errorHandlingWrap<any>(async() => {
			return async() => {
			};
		}),
		...Object.keys(routes).reduce((dict, key) => ({
			...dict, [key]: errorHandlingWrap(routes[key])
		}), {})
	});

	api.init().then(); 	// initialize the backend
	return api;
};
