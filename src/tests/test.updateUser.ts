import request from "supertest";
import { Response } from "../utils/make-api";
import { describeWithApp, getIdToken } from "./test-setup";
import { createUser } from "./test-utils";

describeWithApp("Users", (app) => {
	it("should update user", async() => {
		const createdUser = await createUser(app);
		await request(app)
			.patch("/user")
			.set("Authorization", `Bearer ${ getIdToken({ id: "any" }) }`)
			.query({ userId: createdUser.user.userId })
			.send({ name: "Raghav" })
			.expect("Content-Type", /json/)
			.expect(200)
			.then(({ body }: { body: Response<"updateUser"> }) => {
				expect(body.name).toBe("Raghav");
			});
	});
});
