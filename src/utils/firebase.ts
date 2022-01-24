import { credential, initializeApp } from 'firebase-admin'
import { SERVICE_ACCOUNT_PATH } from '../config.json'

export const firebaseAdmin = initializeApp(
	process.env.NODE_ENV !== 'test' ?
		{ credential: credential.cert(SERVICE_ACCOUNT_PATH) } :
		{ }
)
