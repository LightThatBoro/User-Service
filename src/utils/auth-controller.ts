import { Boom } from "@hapi/boom";
import { IUserType } from "../types";
import { firebaseAdmin } from "./firebase";
import { AuthUser } from "./make-api";

const SCOPE_MAP: { [T in IUserType]: number } = {
	"user": 1,
	"educator": 2,
	"admin": 3
};

const authenticate = async(idToken: string): Promise<AuthUser | boolean> => {
	if(process.env.NODE_ENV === "test") {
		return JSON.parse(idToken);
	}

	return await firebaseAdmin.auth().verifyIdToken(idToken).catch(() => false);
};

export type UserClaim = {
    id: string,
    type: IUserType,
    username: string,
    name: string,
    blocked: boolean,
    profilePic?: string
}

const setUserClaim = async(sub: string, claim: UserClaim): Promise<void> => {
	if(process.env.NODE_ENV === "test") {
		return;
	}

	await firebaseAdmin.auth().setCustomUserClaims(sub, claim);
};

export const userCanAccess = (user: { type?: IUserType }, scopes: string[] | undefined) => {
	// if the route requires some extra priveledge
	if(scopes?.length) {
		// get the minimum scope level
		const scopeLevel = SCOPE_MAP[scopes[0]];
		if(!scopeLevel) {
			throw new Boom("Mis-configured scope", { statusCode: 500, data: scopes });
		}

		// check if user can access the route
		const userLevel = SCOPE_MAP[user.type || ""] || 0;
		if(userLevel < scopeLevel) {
			return false;
		}
	}

	return true;
};

export { authenticate, setUserClaim };
