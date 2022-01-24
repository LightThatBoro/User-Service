import dotenv from 'dotenv'
import mongoose, { connect } from 'mongoose'
import logger from './logger'

const ENV = process.env.NODE_ENV || 'development'

dotenv.config({ path: `.env.${ENV}` })

let mongo: Promise<typeof mongoose>
const getConnection = async(): Promise<typeof mongoose> => {
	const uri = process.env.MONGO_URI
	if(!uri) {
		throw new Error('DB URI absent')
	}

	if(!mongo) {
		const startTime = Date.now()
		mongo = (
			connect(uri)
				.then(db => {
					logger.info({ timeTakenMs: Date.now()-startTime }, 'connected to DB')
					return db
				})
		)
	}

	return mongo
}

export default getConnection
