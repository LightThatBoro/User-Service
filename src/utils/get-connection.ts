import { Connection, ConnectionOptions, createConnection, getConnectionManager } from "typeorm"
import config from '../../ormconfig'
import entities from '../entity'

const CONNECTION_NAME = 'default'
const connectionManager = getConnectionManager()

const conn = async() => {
	let connection: Connection
	if(connectionManager.has(CONNECTION_NAME)) {
		connection = await connectionManager.get(CONNECTION_NAME)
		if(!connection.isConnected) {
			connection = await connection.connect()
		}
	} else {
		console.log('created')
		//@ts-ignore
		config.entities = entities
		connection = await createConnection(config as ConnectionOptions)
	}

	return connection
}

export default conn
