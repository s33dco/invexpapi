/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');

const registeredUser = {
	name: 'True User',
	email: 'valid@email.co.uk',
	password: '1Aa$word'
};

let cookies;

describe('/api', () => {
	beforeEach(async () => {
		const registerUser = () => {
			return request(app)
				.post('/api/users')
				.send(registeredUser);
		};
		const res = await registerUser();
		cookies = res.headers['set-cookie'];
	});

	describe('GET /', () => {
		it('should return 200 response and json', async () => {
			const res = await request(app)
				.get('/api')
				.set('Cookie', cookies);

			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				msg:
					'welcome to the api, this confirms your cookies are in order, feel free to hit the other endpoints.'
			});
		});

		it('should return 401 response and json if no auth cookies', async () => {
			cookies = '';
			const res = await request(app)
				.get('/api')
				.set('Cookie', cookies);

			expect(res.status).toBe(401);
			expect(res.body).toMatchObject({
				msg: 'Authorization denied'
			});
		});
	});
});
