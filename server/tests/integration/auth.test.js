/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user');

// const wholeCookie = cookie => cookie.split(';');
// const cleanCookie = cookie =>
// 	cookie
// 		.split(';')
// 		.shift()
// 		.split('=');
const registeredUser = {
	name: 'True User',
	email: 'valid@email.co.uk',
	password: '1Aa$word'
};

let { email } = registeredUser;
let { password } = registeredUser;
let authToken;

describe('api/auth', () => {
	beforeEach(async () => {
		const registerUser = () => {
			return request(app)
				.post('/api/users')
				.send(registeredUser);
		};
		const response = await registerUser();
		const { token } = response.body;
		authToken = token;
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

		it('should return 200 and auth token', async () => {
			const res = await loginUser();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
		});

		// it('should set 2 cookies', async () => {
		// 	const res = await loginUser();
		// 	const setCookie = res.headers['set-cookie'];
		// 	expect(setCookie.length).toBe(2);
		// });

		// it('should set the signature cookie correctly', async () => {
		// 	const res = await loginUser();
		// 	const setCookie = res.headers['set-cookie'];
		// 	const sig = setCookie[1];
		// 	const fullSignature = wholeCookie(sig);
		// 	expect(fullSignature).toBeArrayOfSize(5);
		// 	expect(fullSignature).toIncludeAnyMembers([
		// 		' Path=/',
		// 		' HttpOnly',
		// 		' Secure',
		// 		' SameSite=Strict'
		// 	]);
		// 	expect(fullSignature).not.toIncludeAnyMembers([' Max-Age=1800']);
		// 	expect(cleanCookie(sig)[1]).toBe(signature);
		// });

		// it('should set the payload cookie correctly', async () => {
		// 	const res = await loginUser();
		// 	const setCookie = res.headers['set-cookie'];
		// 	const pay = setCookie[0];
		// 	const fullPayload = wholeCookie(pay);
		// 	expect(fullPayload).toBeArrayOfSize(6);
		// 	expect(fullPayload).toIncludeAnyMembers([
		// 		' Path=/',
		// 		' HttpOnly',
		// 		' Secure',
		// 		' SameSite=Strict',
		// 		' Max-Age=1800'
		// 	]);
		// 	expect(cleanCookie(pay)[1]).toEqual(payload);
		// });

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
		const getUser = async auth => {
			return request(app)
				.get('/api/auth')
				.set('x-auth-token', auth);
		};

		it('should return 200 and user object', async () => {
			const res = await getUser(authToken);
			expect(res.body).toHaveProperty('name', 'True User');
			expect(res.body).toHaveProperty('_id');
		});

		it('should return 403 with wrong token', async () => {
			const fakeToken = 'p8TiYcfn9rDka_afakeTokenlWjtbFqIn3w0JeLtwc; ';
			const res = await getUser(fakeToken);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('should send Auth denied json if no token', async () => {
			const noTokenInReq = () => {
				return request(app).get('/api/auth');
			};

			const res = await noTokenInReq();
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});
	});
});
