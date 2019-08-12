/**
 * @jest-environment node
 */
const { Client } = require('../../../models/client');
const { savedClient } = require('../../seed/client');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Client', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await savedClient();
	});

	afterEach(async () => {
		await Client.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const client = await Client.find().countDocuments();
		expect(client).toBe(1);
	});
});
