import request from "supertest";
import { FullRequest, Response } from "../utils/make-api";
import { describeWithApp, getIdToken } from "./test-setup";

describeWithApp("Users", (app) => {
	it("should insert user", async() => {
		const reqData = {
			name: "Sahaj",
			phone: "919646943212",
			address: "somewhere",
			email: "a@b.com"
		} as FullRequest<"insertUser">;

		await request(app)
			.post("/user")
			.send(reqData)
			.set("Authorization", `Bearer ${ getIdToken({ id: "any" }) }`)
			.expect("Content-Type", /json/)
			.expect(200)
			.then(({ body }: { body: Response<"insertUser"> }) => {
				expect(body.name).toBe(reqData.name);
				expect(body.phone).toBe(reqData.phone);
				expect(body.userId).toBeDefined();
			});
	});
});
