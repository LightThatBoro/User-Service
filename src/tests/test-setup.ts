require("dotenv").config({ path: ".env.test" });  // ensure we load this one
import { Chance } from "chance";
import { Application } from "express";
import { IUserType } from "../types";
import getConnection from "../utils/get-connection";
import makeTestServer from "./make-test-server";

jest.setTimeout(20_000);

export const getIdToken = ({ email, id, name, type, username, profilePic }: {
    id: string, type?: IUserType,
    email?: string,
    username?: string,
    name?: string,
    profilePic?: string,
}): string => {
	const chance = Chance();
	return JSON.stringify({
		id,
		uid: id, // required only for user creation
		email: email ?? chance.word() + chance.email(),
		firebase: { sign_in_provider: "email" },
		username: username ?? "test",
		name: name ?? "name",
		profilePic: profilePic ?? "profilePic",
		type: type ?? "admin"
	});
};

export const describeWithApp = (
	name: string,
	tests: (
        app: Application
    ) => void,
) => describe(name, () => {
	const app = makeTestServer();
	const conn = getConnection();

	beforeAll(async() => {
		await conn;
	});

	afterAll(async() => {
		await (await conn).close();
	});

	tests(app);
});
