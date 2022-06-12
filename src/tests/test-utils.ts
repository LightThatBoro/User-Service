import request from "supertest";
import { User } from "../entity/User";

export const createUser = async(app: Express.Application, data?: Partial<User>): Promise<{ user: User }> => {

	const res = await request(app)
		.post("/user")
		.send(data || {
			name: "sahaj-test",
			address: "dasda",
			phone: "919834723",
			email: "a@b.com",
		} as Partial<User>);

	expect(res.body.userId).toBeDefined();

	return { user: res.body as User };

};

