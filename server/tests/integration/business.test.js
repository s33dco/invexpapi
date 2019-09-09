/**
 * @jest-environment node
 */
const request = require('supertest');
const { Business } = require('../../models/business');
const { savedUser } = require('../seed/user');
const { User } = require('../../models/user');
const app = require('../../app');
const { connectDB, disconnectDB } = require('../../startup/db');

const registerUserDetails = {
	name: 's33dCode',
	email: 'code@s33d.co',
	password: '1@P!a$£$word'
};

const businessDetails = {
	useMileage: true,
	name: 's33dco',
	contact: 'Delfont',
	email: 'hello@s33d.co',
	phone: '07968999999',
	add1: 'S33d Towers',
	add2: 'Brighton',
	postcode: 'WC1A 1AX',
	bankName: 'fake bank',
	sortCode: '23-23-23',
	accountNo: '23232323',
	utr: '1234567890',
	terms: 'paid upfront',
	farewell: 'with thanks'
};

const returnedBusinessDetails = {
	useMileage: true,
	name: 's33dco',
	contact: 'Delfont'.toLowerCase(),
	email: 'hello@s33d.co'.toLowerCase(),
	phone: '07968999999',
	add1: 'S33d Towers'.toLowerCase(),
	add2: 'Brighton'.toLowerCase(),
	postcode: 'WC1A 1AX'.toUpperCase(),
	bankName: 'fake bank'.toLowerCase(),
	sortCode: '23-23-23',
	accountNo: '23232323',
	utr: '1234567890',
	terms: 'paid upfront'.toLowerCase(),
	farewell: 'with thanks'.toLowerCase()
};

let cookies;
let userId;

describe('business endpoints', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		const registerUser = () => {
			return request(app)
				.post('/api/users')
				.send(registerUserDetails);
		};
		const res = await registerUser();
		cookies = res.headers['set-cookie'];
		const getUserId = () => {
			return request(app)
				.get('/api/auth')
				.set('Cookie', cookies);
		};
		const response = await getUserId();
		userId = response.body._id;
	});

	afterEach(async () => {
		await Business.deleteMany();
		await User.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('GET /business', () => {
		const makeBusiness = () => {
			return request(app)
				.post('/api/business')
				.set('Cookie', cookies)
				.send({ userId, ...businessDetails });
		};

		it('returns the users business record', async () => {
			await makeBusiness();
			const res = await request(app)
				.get('/api/business')
				.set('Cookie', cookies);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({ ...returnedBusinessDetails });
		});

		it('returns error message if not auth', async () => {
			await makeBusiness();
			cookies = 'nogood';
			const res = await request(app)
				.get('/api/business')
				.set('Cookie', cookies);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Authorization denied');
		});

		it('returns message if no business record', async () => {
			const res = await request(app)
				.get('/api/business')
				.set('Cookie', cookies);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'you need to add your business details before proceeding'
			);
		});
	});

	describe('POST /business', () => {
		it('creates business details for user with valid details', async () => {
			const res = await request(app)
				.post('/api/business')
				.set('Cookie', cookies)
				.send({ userId, ...businessDetails });

			expect(res.status).toBe(200);
		});

		it('userId in form has to match user_id from jwt', async () => {
			const fakeUser = await savedUser();
			const res = await request(app)
				.post('/api/business')
				.set('Cookie', cookies)
				.send({ userId: fakeUser._id, ...businessDetails });
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				"Something doesn't add up, give it another go"
			);
		});

		it('return an error msg if no auth', async () => {
			const fakeUser = await savedUser();
			cookies = 'iamafaketoken';
			const res = await request(app)
				.post('/api/business')
				.set('Cookie', cookies)
				.send({ userId: fakeUser._id, ...businessDetails });
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Authorization denied');
		});

		it('400 response and error message if incorrect value for useMileage', () => {
			const options = ['', 'what', 1];
			options.forEach(async option => {
				businessDetails.useMileage = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Yes or no for simplified mileage'
				);
			});
			businessDetails.useMileage = true;
		});

		it('400 response and error message if incorrect value for name', () => {
			const options = ['', '<>', '!@£$%^&**', 1];
			options.forEach(async option => {
				businessDetails.name = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid Business name required');
			});
			businessDetails.name = 's33dco';
		});

		it('400 response and error message if incorrect value for contact', async () => {
			const options = ['', '<>', '!@£$%^&**'];
			options.forEach(async option => {
				businessDetails.contact = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid contact name required');
			});
			businessDetails.contact = 'Delfont';
		});

		it('400 response and error message if incorrect value for email', async () => {
			const options = ['', '<>', '!@£$%^&**', '@me.com'];
			options.forEach(async option => {
				businessDetails.email = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid email address required');
			});
			businessDetails.email = 'hello@s33d.co';
		});

		it('400 response and error message if incorrect value for phone', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a', '@me.com'];
			options.forEach(async option => {
				businessDetails.phone = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid phone number required - just digits'
				);
			});
			businessDetails.phone = '07968999999';
		});

		it('400 response and error message if incorrect value for add1', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a', '@me.com'];
			options.forEach(async option => {
				businessDetails.add1 = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid first line of address required, just word characters'
				);
			});
			businessDetails.add1 = 'S33d Towers';
		});

		it('400 response and error message if incorrect value for add2', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a', '@me.com'];
			options.forEach(async option => {
				businessDetails.add2 = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check second line of address - just word characters'
				);
			});
			delete businessDetails.add2;
		});

		it('400 response and error message if incorrect value for add3', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a', '@me.com'];
			options.forEach(async option => {
				businessDetails.add3 = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check third line of address - just word characters'
				);
			});
			delete businessDetails.add3;
		});

		it('400 response and error message if incorrect value for postcode', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a', '@me.com', 'ASD12 238fgg'];
			options.forEach(async option => {
				businessDetails.postcode = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid postcode required');
			});
			businessDetails.postcode = 'WC1A 1AX';
		});

		it('400 response and error message if incorrect value for bankName', async () => {
			const options = [
				'',
				'<>',
				'!@£$%^&**',
				'n/a',
				'@me.com',
				'ASD12 238!fgg'
			];
			options.forEach(async option => {
				businessDetails.bankName = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid bank name required');
			});
			businessDetails.bankName = 'fake bank';
		});

		it('400 response and error message if incorrect value for sortCode', async () => {
			const options = [
				'',
				'<>',
				'!@£$%^&**',
				'n/a',
				'@me.com',
				'ASD12 238!fgg',
				'123456',
				'12/12/12'
			];
			options.forEach(async option => {
				businessDetails.sortCode = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid sort code required (XX-XX-XX)'
				);
			});
			businessDetails.sortCode = '23-23-23';
		});

		it('400 response and error message if incorrect value for accountNo', async () => {
			const options = [
				'',
				'<>',
				'!@£$%^&**',
				'n/a',
				'@me.com',
				'ASD12 238!fgg',
				'1234567',
				'12/12/12',
				'123456789'
			];
			options.forEach(async option => {
				businessDetails.accountNo = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid account number required - 8 digits only'
				);
			});
			businessDetails.accountNo = '23232323';
		});

		it('400 response and error message if incorrect value for utr', async () => {
			const options = [
				'',
				'<>',
				'!@£$%^&**',
				'n/a',
				'@me.com',
				'ASD12 238!fgg',
				'1234567',
				'12/12/12',
				'123456789333',
				'1234 1234'
			];
			options.forEach(async option => {
				businessDetails.utr = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid tax reference required');
			});
			businessDetails.utr = '1234567890';
		});

		it('400 response and error message if incorrect value for terms', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a'];
			options.forEach(async option => {
				businessDetails.terms = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'enter your terms - just regular characters'
				);
			});
			businessDetails.terms = 'paid upfront';
		});

		it('400 response and error message if incorrect value for farewell', async () => {
			const options = ['', '<>', '!@£$%^&**', 'n/a!', '?'];
			options.forEach(async option => {
				businessDetails.farewell = option;
				const res = await request(app)
					.post('/api/business')
					.set('Cookie', cookies)
					.send({ userId, ...businessDetails });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'enter your farewell - just regular characters'
				);
			});
			businessDetails.farewell = 'with thanks';
		});
	});
});
