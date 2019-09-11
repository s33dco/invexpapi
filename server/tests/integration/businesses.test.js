/**
 * @jest-environment node
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { Business } = require('../../models/business');
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
const returnedUpdatedDetails = {
	useMileage: true,
	name: 's33dco',
	contact: 'Tarquin'.toLowerCase(),
	email: 'TARQUIN@s33d.co'.toLowerCase(),
	phone: '07968999999',
	add1: 's33d Square'.toLowerCase(),
	add2: 'Brighton'.toLowerCase(),
	postcode: 'bn1 1aa'.toUpperCase(),
	bankName: 'Massive BANK LTD'.toLowerCase(),
	sortCode: '23-23-23',
	accountNo: '55555555',
	utr: '1234567890',
	terms: 'CASH ONLY'.toLowerCase(),
	farewell: 'TA RA'.toLowerCase()
};
const updateDetails = {
	useMileage: true,
	name: 's33dco',
	contact: 'Tarquin',
	email: 'TARQUIN@s33d.co',
	phone: '07968999999',
	add1: 's33d Square',
	add2: 'Brighton',
	postcode: 'bn1 1aa',
	bankName: 'Massive BANK LTD',
	sortCode: '23-23-23',
	accountNo: '55555555',
	utr: '1234567890',
	terms: 'cash only',
	farewell: 'ta ra'
};
let cookies;
let amendedDetails;

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
	});

	afterEach(async () => {
		await Business.deleteMany();
		await User.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('GET / business', () => {
		const makeBusiness = () => {
			return request(app)
				.post('/api/businesses')
				.set('Cookie', cookies)
				.send(businessDetails);
		};

		it('returns the users business record', async () => {
			await makeBusiness();
			const res = await request(app)
				.get('/api/businesses')
				.set('Cookie', cookies);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject(returnedBusinessDetails);
		});

		it('returns error message if not auth', async () => {
			await makeBusiness();
			cookies = 'nogood';
			const res = await request(app)
				.get('/api/businesses')
				.set('Cookie', cookies);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('returns message if no business record', async () => {
			const res = await request(app)
				.get('/api/businesses')
				.set('Cookie', cookies);
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty(
				'msg',
				'you need to add your business details before proceeding'
			);
		});
	});

	describe('POST / business', () => {
		it('creates business details for user with valid details', async () => {
			const res = await request(app)
				.post('/api/businesses')
				.set('Cookie', cookies)
				.send(businessDetails);
			expect(res.status).toBe(200);
		});

		it('return an error msg if no auth', async () => {
			cookies = 'iamafaketoken';
			const res = await request(app)
				.post('/api/businesses')
				.set('Cookie', cookies)
				.send(businessDetails);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('will not accept additional fields', async () => {
			const extraField = { ...businessDetails, extraField: 'sneaky input' };
			const res = await request(app)
				.post('/api/businesses')
				.set('Cookie', cookies)
				.send(extraField);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', '"extraField" is not allowed');
		});

		it('400 response and error message if incorrect value for useMileage', () => {
			const options = ['', 'what', 1];
			options.forEach(async option => {
				businessDetails.useMileage = option;
				const res = await request(app)
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
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
					.post('/api/businesses')
					.set('Cookie', cookies)
					.send(businessDetails);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'enter your farewell - just regular characters'
				);
			});
			businessDetails.farewell = 'with thanks';
		});
	});

	describe('PUT / business', () => {
		const createBusinessID = async () => {
			const response = await request(app)
				.post('/api/businesses')
				.set('Cookie', cookies)
				.send(businessDetails);
			const { _id } = response.body;
			return _id;
		};
		const updateBusiness = (id, update) => {
			return request(app)
				.put(`/api/businesses/${id}`)
				.set('Cookie', cookies)
				.send(update);
		};

		it('updates business record with valid input', async () => {
			const id = await createBusinessID();
			const res = await updateBusiness(id, updateDetails);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject(returnedUpdatedDetails);
		});

		it("won't accept any additional fields", async () => {
			const id = await createBusinessID();
			const res = await updateBusiness(id, {
				...updateDetails,
				fakeField: 'naughty input'
			});
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
		});

		it('sends 404 if params id not found', async () => {
			const fakeId = mongoose.Types.ObjectId().toHexString();
			const res = await updateBusiness(fakeId, updateDetails);
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('msg', 'Business details not found.');
		});

		it('send 403 if userId in record !== req.user.id', async () => {
			const id = await createBusinessID();
			// get new cookies for different user
			const registerUser = () => {
				return request(app)
					.post('/api/users')
					.send({
						name: 'A Different Drummer',
						email: 'drumming@differently.com',
						password: '1@P!a$£$word'
					});
			};
			const response = await registerUser();
			cookies = response.headers['set-cookie'];

			const res = await updateBusiness(id, updateDetails);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		describe('validates form data', () => {
			it('validates useMileage', async () => {
				const id = await createBusinessID();
				const options = ['', 'yes', 1];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, useMileage: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Yes or no for simplified mileage'
					);
				});
			});

			it('validates use name', async () => {
				const id = await createBusinessID();
				const options = ['*&()', '<>', 1, ''];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, name: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid Business name required'
					);
				});
			});

			it('validates use contact', async () => {
				const id = await createBusinessID();
				const options = ['*&()', '<>', 1, ''];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, contact: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'Valid contact name required');
				});
			});

			it('validates use email', async () => {
				const id = await createBusinessID();
				const options = ['*&()', '<>', 1, '', '@email'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, email: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid email address required'
					);
				});
			});

			it('validates use phone', async () => {
				const id = await createBusinessID();
				const options = ['0127345982735235', '<>', 1, '', '@phone', '876'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, phone: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid phone number required - just digits'
					);
				});
			});

			it('validates use add1', async () => {
				const id = await createBusinessID();
				const options = ['<>', 1, '', '@phone', '876!@£$%*^%'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, add1: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid first line of address required, just word characters'
					);
				});
			});

			it('validates use add2', async () => {
				const id = await createBusinessID();
				const options = ['<>', 1, '', '@phone', '876!@£$%*^%'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, add2: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Check second line of address - just word characters'
					);
				});
			});

			it('validates use add3', async () => {
				const id = await createBusinessID();
				const options = ['<>', 1, '', '@phone', '876!@£$%*^%'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, add3: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Check third line of address - just word characters'
					);
				});
			});

			it('validates use postcode', async () => {
				const id = await createBusinessID();
				const options = ['<>', 1, '', '@phone', '876!@£$%*^%', 'postcode'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, postcode: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'Valid postcode required');
				});
			});

			it('validates use accountNo', async () => {
				const id = await createBusinessID();
				const options = [
					'<>',
					1,
					'',
					'@phone',
					'876!@£$%*^%',
					'accountNo',
					'987238971247124',
					'121'
				];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, accountNo: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid account number required - 8 digits only'
					);
				});
			});

			it('validates use utr', async () => {
				const id = await createBusinessID();
				const options = [
					'<>',
					1,
					'',
					'@phone',
					'876!@£$%*^%',
					'utr',
					'987238923471247124',
					'121'
				];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, utr: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid tax reference required'
					);
				});
			});

			it('validates use terms', async () => {
				const id = await createBusinessID();
				const options = ['<>', '876!@£$%*^%'];
				options.forEach(async option => {
					amendedDetails = { ...updateDetails, terms: option };
					const res = await updateBusiness(id, amendedDetails);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'enter your terms - just regular characters'
					);
				});
			});
		});
	});
});
