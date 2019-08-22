/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user');

const wholeCookie = cookie => cookie.split(';');
const cleanCookie = cookie =>
	cookie
		.split(';')
		.shift()
		.split('=');
let name = 'True User';
let email = 'valid@email.co.uk';
let password = '1Aa$word';

describe('api/users', () => {
	afterEach(async () => {
		await User.deleteMany();
	});

	describe('POST / register', () => {
		const registerUser = async () => {
			return request(app)
				.post('/api/users')
				.send({ name, email, password });
		};

		it('should return 200 status and json msg', async () => {
			const res = await registerUser();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty(
				'msg',
				'True User successfully registered'
			);
		});

		it('should set 2 cookies to make the jwt', async () => {
			const res = await registerUser();
			const setCookie = res.headers['set-cookie'];
			expect(setCookie.length).toBe(2);
		});

		it('should set the signature cookie correctly', async () => {
			const res = await registerUser();
			const setCookie = res.headers['set-cookie'];
			const sig = setCookie[1];
			const fullSignature = wholeCookie(sig);
			expect(fullSignature).toBeArrayOfSize(5);
			expect(fullSignature).toIncludeAnyMembers([
				' Path=/',
				' HttpOnly',
				' Secure',
				' SameSite=Strict'
			]);
			expect(fullSignature).not.toIncludeAnyMembers([' Max-Age=1800']);
			expect(cleanCookie(sig)[0]).toBe('signature');
		});

		it('should set the payload cookie correctly', async () => {
			const res = await registerUser();
			const setCookie = res.headers['set-cookie'];
			const pay = setCookie[0];
			const fullPayload = wholeCookie(pay);
			expect(fullPayload).toBeArrayOfSize(6);
			expect(fullPayload).toIncludeAnyMembers([
				' Path=/',
				' HttpOnly',
				' Secure',
				' SameSite=Strict',
				' Max-Age=1800'
			]);
			expect(cleanCookie(pay)[0]).toEqual('payload');
		});

		it('return 400 if email address already exists', async () => {
			await registerUser();
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'User already exists');
		});

		it('should return 400 if no name sent', async () => {
			name = '';
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'name should be 1-20 letters');
		});

		it('should return 400 if  name > 20 characters', async () => {
			name = 'A very long name more than twenty charcters';
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'name should be 1-20 letters');
		});

		it('should return 400 if name includes non word chareacters', async () => {
			name = '%$^£**@(@';
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'name should be 1-20 letters');
		});

		it('should return 400 if no email sent', async () => {
			name = 'True User';
			email = '';
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'email must be a valid address');
		});

		it('should return 400 if invalid email sent', async () => {
			email = 'tony@email';
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'email must be a valid address');
		});

		it('should return 400 if no password sent', async () => {
			name = 'True User';
			email = 'valid@email.co.uk';
			password = '';
			const res = await registerUser();
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
				const res = await registerUser();
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
				);
			});
		});

		it('should return 400 if password > 255', async () => {
			password = new Array(80).join('aA1$');
			const res = await registerUser();
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'password requires atleast one uppercase & lowercase letter, one number & one special character (@£$!%*?&), between 8 and 255 characters long'
			);
		});
	});
});
