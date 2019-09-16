/**
 * @jest-environment node
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { Client } = require('../../models/client');
const { User } = require('../../models/user');
const app = require('../../app');

const registerUserDetails = {
	name: 's33dCode',
	email: 'code@s33d.co',
	password: '1@P!a$£$word'
};
const testClient = {
	name: 'John CLIENT',
	email: 'JOHN@CLIENT.CO.UK',
	phone: '07945723456',
	add1: '23 BIG ROAD',
	add2: 'SMALLTOWN',
	add3: 'COUNTY',
	postcode: 'ww12 3io'
};
const returnedClientDetails = {
	name: 'John CLIENT'.toLowerCase(),
	email: 'JOHN@CLIENT.CO.UK'.toLowerCase(),
	phone: '07945723456',
	add1: '23 BIG ROAD'.toLowerCase(),
	add2: 'SMALLTOWN'.toLowerCase(),
	add3: 'COUNTY'.toLowerCase(),
	postcode: 'ww12 3io'.toUpperCase()
};
let authToken;
let clients;

const makeToken = async user => {
	const res = await request(app)
		.post('/api/users')
		.send(user);
	const { token } = res.body;
	return token;
};
const makeClients = (auth, number) => {
	clients = [];
	while (clients.length < number) {
		clients.push(testClient);
	}
	clients.forEach(async client => {
		await makeClient(auth, client);
	});
};
const makeClient = (auth, details) => {
	return request(app)
		.post('/api/clients')
		.set('x-auth-token', auth)
		.send(details);
};
const createClientID = async (token, details) => {
	const response = await request(app)
		.post('/api/clients')
		.set('x-auth-token', token)
		.send(details);
	const { _id } = response.body;
	return _id;
};
const updateClient = (token, id, update) => {
	return request(app)
		.put(`/api/clients/${id}`)
		.set('x-auth-token', token)
		.send(update);
};
const getClient = (token, id) => {
	return request(app)
		.get(`/api/clients/${id}`)
		.set('x-auth-token', token);
};
const getClients = token => {
	return request(app)
		.get('/api/clients')
		.set('x-auth-token', token);
};
const deleteClient = (token, id) => {
	return request(app)
		.get(`/api/clients/${id}`)
		.set('x-auth-token', token);
};
beforeEach(async () => {
	authToken = await makeToken(registerUserDetails);
});

afterEach(async () => {
	await Client.deleteMany();
	await User.deleteMany();
});

describe('GET /', () => {
	it('returns the users clients', async () => {
		await makeClients(authToken, 5);
		const res = await getClients(authToken);
		expect(res.status).toBe(200);
		expect(res.body).toBeArray();
		expect(res.body).toHaveLength(5);
	});

	it('returns 401 and message if not auth', async () => {
		const res = await getClients('');
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 and message if invalid auth', async () => {
		const res = await getClients('7u32h3yf9238f9238fy98f');
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 404 and message if no client found', async () => {
		const diffToken = await makeToken({
			...registerUserDetails,
			email: 'today@tomorrow.co.uk',
			name: 'Different Person'
		});
		const res = await getClients(diffToken);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty(
			'msg',
			'you need to add atleast one client before proceeding'
		);
	});

	it('only returns logged in users clients', async () => {
		const userOneToken = await makeToken({
			...registerUserDetails,
			email: 'today@tomorrow.co.uk',
			name: 'Different Person'
		});
		await makeClients(userOneToken, 9);
		const userTwoToken = await makeToken({
			...registerUserDetails,
			email: 'hello@token.co.uk',
			name: 'Another Person'
		});
		await makeClients(userTwoToken, 3);
		const resOne = await getClients(userOneToken);
		const resTwo = await getClients(userTwoToken);
		expect(resOne.status).toBe(200);
		expect(resTwo.status).toBe(200);
		expect(resOne.body).toBeArray();
		expect(resOne.body).toHaveLength(9);
		expect(resTwo.body).toBeArray();
		expect(resTwo.body).toHaveLength(3);
	});
});

describe('POST /', () => {
	it('creates client details for user with valid details', async () => {
		const res = await makeClient(authToken, testClient);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it("won't accept additional form fields", async () => {
		const res = await makeClient(authToken, {
			...testClient,
			fakeField: 'erroneous info'
		});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('returns 401 an error msg if no token', async () => {
		const res = await makeClient('', testClient);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 an error msg if invalid token', async () => {
		const res = await makeClient('8787978798wqdhkqwhdkqwd', testClient);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('400 response and error message if incorrect value for name', () => {
		const options = ['', '<>', '!@£$%^&**', 1];
		options.forEach(async option => {
			testClient.name = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid Client name required');
		});
		testClient.name = 'John CLIENT';
	});

	it('400 response and error message if incorrect value for email', () => {
		const options = ['', '<>', '!@£$%^&**', 1, '@email'];
		options.forEach(async option => {
			testClient.email = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid email address required');
		});
		testClient.email = 'JOHN@CLIENT.CO.UK';
	});

	it('400 response and error message if incorrect value for phone', () => {
		const options = ['', '<>', '!@£$%^&**', 1, '01273', '076542776868678936'];
		options.forEach(async option => {
			testClient.phone = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'Valid phone number required - just digits'
			);
		});
		testClient.phone = '07945723456';
	});

	it('400 response and error message if incorrect value for add1', () => {
		const options = ['', '<>', '!@£$%^&**'];
		options.forEach(async option => {
			testClient.add1 = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'Valid first line of address required, just word characters'
			);
		});
		testClient.add1 = '23 BIG ROAD';
	});

	it('400 response and error message if incorrect value for add2', () => {
		const options = ['', '<>', '!@£$%^&**'];
		options.forEach(async option => {
			testClient.add2 = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'Check second line of address - just word characters'
			);
		});
		testClient.add2 = 'SMALLTOWN';
	});

	it('400 response and error message if incorrect value for add3', () => {
		const options = ['', '<>', '!@£$%^&**'];
		options.forEach(async option => {
			testClient.add3 = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty(
				'msg',
				'Check third line of address - just word characters'
			);
		});
		testClient.add3 = 'COUNTY';
	});

	it('400 response and error message if incorrect value for postcode', () => {
		const options = ['', '<>', '!@£$%^&**', 'qwertyuoi', 'no postcode'];
		options.forEach(async option => {
			testClient.postcode = option;
			const res = await makeClient(authToken, testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid postcode required');
		});
		testClient.postcode = 'ww12 3io';
	});
});

describe('PUT / :id', () => {
	it('updates a client record with valid input', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await updateClient(authToken, id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('name', "you've changed");
	});

	it("won't accept additional form fields", async () => {
		const id = await createClientID(authToken, testClient);
		const res = await updateClient(authToken, id, {
			...testClient,
			fakeField: "You've Changed"
		});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await updateClient('', id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID(authToken);
		const diffToken = makeToken({ ...registerUserDetails, name: 'Benny Jets' });
		const res = await updateClient(diffToken, id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	describe('validates form data', () => {
		it('validates name', async () => {
			const id = await createClientID(authToken);
			const options = ['', '<>', '!@£$%^&**', 1];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					name: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid Client name required');
			});
		});

		it('validates email', async () => {
			const id = await createClientID(authToken);
			const options = ['', '<>', '!@£$%^&**', 1, '@tony', 'no email'];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					email: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid email address required');
			});
		});

		it('validates phone', async () => {
			const id = await createClientID(authToken);
			const options = ['01273', '+44 7899 678678', '0113246782345'];
			options.forEach(async option => {
				const update = { ...testClient, phone: option };
				const res = await updateClient(authToken, id, update);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid phone number required - just digits'
				);
			});
		});

		it('validates add1', async () => {
			const id = await createClientID(authToken);
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					add1: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid first line of address required, just word characters'
				);
			});
		});

		it('validates add2', async () => {
			const id = await createClientID(authToken);
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					add2: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check second line of address - just word characters'
				);
			});
		});

		it('validates add3', async () => {
			const id = await createClientID(authToken);
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					add3: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check third line of address - just word characters'
				);
			});
		});

		it('validates postcode', async () => {
			const id = await createClientID(authToken);
			const options = [
				'',
				'<>',
				'!@£$%^&**',
				1,
				'<%>',
				{},
				'daser12 123',
				'91232'
			];
			options.forEach(async option => {
				const res = await updateClient(authToken, id, {
					...testClient,
					postcode: option
				});
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid postcode required');
			});
		});
	});
});

describe('GET / :id', () => {
	it('returns the correct client record', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await getClient(authToken, id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await getClient('', id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID(authToken, testClient);
		const diffToken = await makeToken({
			...registerUserDetails,
			email: 'bob@james.com'
		});
		const res = await getClient(diffToken, id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('return a 404 if client not found', async () => {
		const id = mongoose.Types.ObjectId();
		const res = await getClient(authToken, id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'Client details not found');
	});
});

describe('DELETE / :id', () => {
	it('returns the correct client record', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await deleteClient(authToken, id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID(authToken, testClient);
		const res = await deleteClient('', id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID(authToken, testClient);
		const diffToken = await makeToken({
			...registerUserDetails,
			email: 'bob@bob.com'
		});
		const res = await deleteClient(diffToken, id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('return a 404 if client not found', async () => {
		const id = mongoose.Types.ObjectId();
		const res = await deleteClient(authToken, id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'Client details not found');
	});
});
