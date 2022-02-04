import { Boom } from "@hapi/boom";
import { Handler } from "../utils/make-api";

// the "Handler" type automatically does type checks for the response as well
const handler: Handler<"createUser"> = async(
	{}, // the parameters, query & request body are automatically combined
	{ db },
	{ firebaseAuth } // user that made the request
) => {
	throw new Boom("Not implemented", { statusCode: 404 });
};

export default handler;
