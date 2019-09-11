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
let cookies;
let clients;

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
	await Client.deleteMany();
	await User.deleteMany();
});

describe('GET /', () => {
	const makeClient = async details => {
		await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(details);
	};
	const makeFiveClients = async () => {
		clients = [];
		while (clients.length < 5) {
			clients.push(testClient);
		}
		clients.forEach(async c => {
			await makeClient(c);
		});
	};

	it('returns the users clients', async () => {
		await makeFiveClients();
		const res = await request(app)
			.get('/api/clients')
			.set('Cookie', cookies);
		expect(res.status).toBe(200);
		expect(res.body).toBeArray();
		expect(res.body).toHaveLength(5);
	});

	it('returns 401 and message if not auth', async () => {
		cookies = '';
		const res = await request(app)
			.get('/api/clients')
			.set('Cookie', cookies);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 404 and message if no client found', async () => {
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
		const res = await request(app)
			.get('/api/clients')
			.set('Cookie', cookies);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty(
			'msg',
			'you need to add atleast one client before proceeding'
		);
	});

	it('only returns logged in users clients', async () => {
		await makeFiveClients();
		const resa = await request(app)
			.get('/api/clients')
			.set('Cookie', cookies);
		expect(resa.status).toBe(200);
		expect(resa.body).toBeArray();
		expect(resa.body).toHaveLength(5);
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
		await makeClient(testClient);
		const res = await request(app)
			.get('/api/clients')
			.set('Cookie', cookies);
		expect(res.status).toBe(200);
		expect(res.body).toBeArray();
		expect(res.body).toHaveLength(1);
	});
});

describe('POST /', () => {
	it('creates client details for user with valid details', async () => {
		const res = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(testClient);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it("won't accept additional form fields", async () => {
		const res = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send({ ...testClient, fakeField: 'erroneous info' });
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('return an error msg if no auth', async () => {
		cookies = 'iamafaketoken';
		const res = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(testClient);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('400 response and error message if incorrect value for name', () => {
		const options = ['', '<>', '!@£$%^&**', 1];
		options.forEach(async option => {
			testClient.name = option;
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid Client name required');
		});
		testClient.name = 'John CLIENT';
	});

	it('400 response and error message if incorrect value for email', () => {
		const options = ['', '<>', '!@£$%^&**', 1, '@email'];
		options.forEach(async option => {
			testClient.email = option;
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid email address required');
		});
		testClient.email = 'JOHN@CLIENT.CO.UK';
	});

	it('400 response and error message if incorrect value for phone', () => {
		const options = ['', '<>', '!@£$%^&**', 1, '01273', '076542776868678936'];
		options.forEach(async option => {
			testClient.phone = option;
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
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
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
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
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
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
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
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
			const res = await request(app)
				.post('/api/clients')
				.set('Cookie', cookies)
				.send(testClient);
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', 'Valid postcode required');
		});
		testClient.postcode = 'ww12 3io';
	});
});

describe('PUT / :id', () => {
	const createClientID = async () => {
		const response = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(testClient);
		const { _id } = response.body;
		return _id;
	};

	const updateClient = (id, update) => {
		return request(app)
			.put(`/api/clients/${id}`)
			.set('Cookie', cookies)
			.send(update);
	};

	it('updates a client record with valid input', async () => {
		const id = await createClientID();
		const res = await updateClient(id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('name', "you've changed");
	});

	it("won't accept additional form fields", async () => {
		const id = await createClientID();
		const res = await updateClient(id, {
			...testClient,
			fakeField: "You've Changed"
		});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID();
		cookies = '';
		const res = await updateClient(id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID();
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
		const res = await updateClient(id, {
			...testClient,
			name: "You've Changed"
		});
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	describe('validates form data', () => {
		it('validates name', async () => {
			const id = await createClientID();
			const options = ['', '<>', '!@£$%^&**', 1];
			options.forEach(async option => {
				const res = await updateClient(id, { ...testClient, name: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid Client name required');
			});
		});

		it('validates email', async () => {
			const id = await createClientID();
			const options = ['', '<>', '!@£$%^&**', 1, '@tony', 'no email'];
			options.forEach(async option => {
				const res = await updateClient(id, { ...testClient, email: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid email address required');
			});
		});

		it('validates phone', async () => {
			const id = await createClientID();
			const options = ['01273', '+44 7899 678678', '0113246782345'];
			options.forEach(async option => {
				const update = { ...testClient, phone: option };
				const res = await updateClient(id, update);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid phone number required - just digits'
				);
			});
		});

		it('validates add1', async () => {
			const id = await createClientID();
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(id, { ...testClient, add1: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Valid first line of address required, just word characters'
				);
			});
		});

		it('validates add2', async () => {
			const id = await createClientID();
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(id, { ...testClient, add2: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check second line of address - just word characters'
				);
			});
		});

		it('validates add3', async () => {
			const id = await createClientID();
			const options = ['', '<>', '!@£$%^&**', 1, '<%>', {}];
			options.forEach(async option => {
				const res = await updateClient(id, { ...testClient, add3: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty(
					'msg',
					'Check third line of address - just word characters'
				);
			});
		});

		it('validates postcode', async () => {
			const id = await createClientID();
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
				const res = await updateClient(id, { ...testClient, postcode: option });
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid postcode required');
			});
		});
	});
});

describe('GET / :id', () => {
	const createClientID = async () => {
		const response = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(testClient);
		const { _id } = response.body;
		return _id;
	};

	const getClient = id => {
		return request(app)
			.get(`/api/clients/${id}`)
			.set('Cookie', cookies);
	};

	it('returns the correct client record', async () => {
		const id = await createClientID();
		const res = await getClient(id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID();
		cookies = '';
		const res = await getClient(id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID();
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
		const res = await getClient(id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('return a 404 if client not found', async () => {
		const id = mongoose.Types.ObjectId();
		const res = await getClient(id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'Client details not found');
	});
});

describe('DELETE / :id', () => {
	const createClientID = async () => {
		const response = await request(app)
			.post('/api/clients')
			.set('Cookie', cookies)
			.send(testClient);
		const { _id } = response.body;
		return _id;
	};

	const deleteClient = id => {
		return request(app)
			.get(`/api/clients/${id}`)
			.set('Cookie', cookies);
	};

	it('returns the correct client record', async () => {
		const id = await createClientID();
		const res = await deleteClient(id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedClientDetails);
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await createClientID();
		cookies = '';
		const res = await deleteClient(id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await createClientID();
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
		const res = await deleteClient(id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('return a 404 if client not found', async () => {
		const id = mongoose.Types.ObjectId();
		const res = await deleteClient(id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'Client details not found');
	});
});
