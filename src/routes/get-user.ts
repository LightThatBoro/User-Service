import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Handler } from "../utils/make-api";

// the "Handler" type automatically does type checks for the response as well
const handler: Handler<"getUser"> = async(
	{ userId }, // the parameters, query & request body are automatically combined
	{ db },
	{ firebaseAuth } // user that made the request
) => {
	const userRepo = getRepository(User);

	const res = await userRepo.findByIds(userId);

	return { users: res };
};

export default handler;
