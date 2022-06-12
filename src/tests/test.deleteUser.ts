import request from "supertest";
import { Response } from "../utils/make-api";
import { describeWithApp, getIdToken } from "./test-setup";
import { createUser } from "./test-utils";

describeWithApp("Users", (app) => {
	it("should delete user", async() => {
		const createdUser = await createUser(app);
		await request(app)
			.delete("/user")
			.set("Authorization", `Bearer ${ getIdToken({ id: "any" }) }`)
			.query({ userId: createdUser.user.userId })
			.expect("Content-Type", /json/)
			.expect(200)
			.then(({ body }: { body: Response<"deleteUser"> }) => {
				expect(body.deletedCount).toBe(1);
			});
	});
});
