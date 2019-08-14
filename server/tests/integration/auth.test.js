/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user');

const name = 'True User';
let email = 'valid@email.co.uk';
let password = '1Aa$word';

describe('api/auth', () => {
	beforeEach(async () => {
		const registerUser = async () => {
			return request(app)
				.post('/api/users')
				.send({ name, email, password });
		};
		await registerUser();
	});

	afterEach(async () => {
		await User.deleteMany();
	});

	describe('POST / (login)', () => {
		const loginUser = async () => {
			return request(app)
				.post('/api/auth')
				.send({ email: email, password: password });
		};

		it('should return 200 and token with correct user info', async () => {
			const res = await loginUser();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
		});

		it('should return 400 if password/email combination wrong', async () => {
			password = '@£$1WrongPassword$$';
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
		});

		it('should return 400 if no email sent', async () => {
			email = '';
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'email must be a valid address');
		});

		it('should return 400 if invalid email sent', async () => {
			email = 'tony@email';
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'email must be a valid address');
		});

		it('should return 400 if email cannot be found', async () => {
			email = 'incorrect@email.co.uk';
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
		});

		it('should return 400 if no password sent', async () => {
			email = 'valid@email.co.uk';
			password = '';
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
			);
		});

		it("should return 400 if password doesn't meet regexp criteria", async () => {
			const passwords = [
				'password',
				'2short',
				'nouppercase1£',
				'NOLOWERCASE1%',
				'nOnUmBeR$$',
				'NoSpec1alCharacters'
			];

			passwords.forEach(async badWord => {
				password = badWord;
				const res = await loginUser();
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
				);
			});
		});

		it('should return 400 if password > 255', async () => {
			password = new Array(80).join('aA1$');
			const res = await loginUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
			);
		});
	});

	describe('GET /', () => {
		const registerUser = async () => {
			return request(app)
				.post('/api/users')
				.send({
					name: 'Frankie',
					email: 'frank@frank.com',
					password: '1Frank13$$'
				});
		};

		const loginUser = async () => {
			return request(app)
				.post('/api/auth')
				.send({ email: 'frank@frank.com', password: '1Frank13$$' });
		};

		const getUser = async token => {
			return request(app)
				.get('/api/auth')
				.set('x-auth-token', token);
		};

		it('should return 200 and user object', async () => {
			await registerUser();
			const response = await loginUser();
			const { token } = response.body;
			const res = await getUser(token);
			expect(res.body).toContainKeys(['_id', 'name', 'email']);
			expect(res.body).toContainValues(['frank@frank.com', 'Frankie']);
		});

		it('should return 401 with wrong token', async () => {
			await registerUser();
			const token =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWQ1MzRjZWFmZTJhMWMxOGMzN2YyMWYwIiwibmFtZSI6IlRydWUgVXNlciJ9LCJpYXQiOjE1NjU4MTQ4NTUsImV4cCI6MTU2NTgxODQ1NX0.jT6PgblMC7TtpZRIbkM2n65I5eGX2tbq63vf4M4_YUU';
			const res = await getUser(token);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'token is not valid');
		});

		it('should say no token', async () => {
			const noTokenReq = () => {
				return request(app).get('/api/auth');
			};

			const res = await noTokenReq();
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
		});
	});
});
