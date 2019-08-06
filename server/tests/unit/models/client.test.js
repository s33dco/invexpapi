/**
 * @jest-environment node
 */
const { Client } = require('../../../models/client');
const { savedClient } = require('../../seed/client');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Client', () => {
	beforeEach(async () => {
		await connectDB();
		await savedClient();
	});

	afterEach(async () => {
		await Client.deleteMany();
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const client = await Client.find().countDocuments();
		expect(client).toBe(1);
	});
});
