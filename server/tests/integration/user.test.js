/**
 * @jest-environment node
 */

const request = require('supertest');
const app = require('../../app');
const { User } = require('../../models/user');

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

		it('should return 200 and token with correct user info', async () => {
			const res = await registerUser();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
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
