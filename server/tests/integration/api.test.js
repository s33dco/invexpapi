/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user');

const registeredUser = {
	name: 'True User',
	email: 'valid@email.co.uk',
	password: '1Aa$word'
};

let authToken;

const getAPI = auth => {
	return request(app)
		.get('/api')
		.set('x-auth-token', authToken);
};

describe('/api', () => {
	beforeEach(async () => {
		const registerUser = () => {
			return request(app)
				.post('/api/users')
				.send(registeredUser);
		};
		const res = await registerUser();
		const { token } = res.body;
		authToken = token;
	});

	afterEach(async () => {
		await User.deleteMany();
	});

	describe('GET /', () => {
		it('should return 200 response and json', async () => {
			const res = await getAPI(authToken);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({
				msg:
					'welcome to the api, this confirms your cookies are in order, feel free to hit the other endpoints.'
			});
		});

		it('should return 401 response if no token', async () => {
			authToken = '';
			const res = await getAPI(authToken);
			expect(res.status).toBe(401);
			expect(res.body).toMatchObject({
				msg: 'Not Authorised'
			});
		});

		it('should return 403 response if invalid token', async () => {
			authToken = '8739247923h4kj2h34k23kj4h2hg4k32';
			const res = await getAPI(authToken);
			expect(res.status).toBe(403);
			expect(res.body).toMatchObject({
				msg: 'Not Authorised'
			});
		});
	});
});
