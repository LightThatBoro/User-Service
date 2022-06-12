import request from "supertest";
import { Response } from "../utils/make-api";
import { describeWithApp, getIdToken } from "./test-setup";
import { createUser } from "./test-utils";

describeWithApp("Users", (app) => {
	it("should get user", async() => {
		const createdUser = await createUser(app);
		await request(app)
			.get("/user")
			.set("Authorization", `Bearer ${ getIdToken({ id: "any" }) }`)
			.query({ userId: createdUser.user.userId })
			.expect("Content-Type", /json/)
			.expect(200)
			.then(({ body }: {body: Response<"getUser">}) => {
				expect(body.users).toHaveLength(1);
			});
	});
});
