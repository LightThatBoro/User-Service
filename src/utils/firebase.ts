import { credential, initializeApp } from "firebase-admin";
import { SERVICE_ACCOUNT_PATH } from "../config.json";

let firebaseAdmin;

export const getFirebaseAdmin = () => {
	if(!firebaseAdmin) {
		firebaseAdmin = initializeApp(
			process.env.NODE_ENV !== "test" ?
				{ credential: credential.cert(SERVICE_ACCOUNT_PATH) } :
				{ }
		);
	}

	return firebaseAdmin;
};
