import request from "supertest";
import { describeWithApp, getIdToken } from "./test-setup";

describeWithApp("Users", (app) => {
	it("should create user", async() => {
		await request(app)
			.get("/users")
			.set("Authorization", `Bearer ${ getIdToken({ id: "any" }) }`)
			.send({})
			.expect("Content-Type", /json/)
			.expect(200)
			.then(() => {
			});
	});
});
