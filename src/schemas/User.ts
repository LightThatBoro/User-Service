import { model, Schema } from 'mongoose'
import { IUser } from '../types'

const UserSchema: Schema = new Schema<IUser>({
	type: { type: String, required: true }
})

export default model<IUser>('User', UserSchema)
