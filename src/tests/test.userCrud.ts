import request from 'supertest'
import { describeWithApp, getIdToken } from './test-setup'

describeWithApp('User', (app) => {
	it('should get users', async() => {
		await request(app)
			.get('/users')
			.set('Authorization', `Bearer ${ getIdToken({ id: 'any' }) }`)
			.send({})
			.expect('Content-Type', /json/)
			.expect(200)
			.then(() => {
			})
	})
})
