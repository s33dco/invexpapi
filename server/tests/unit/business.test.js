/**
 * @jest-environment node
 */
const { Business } = require('../../models/business');
const { saveBusiness } = require('../seed/business');
const { connectDB, disconnectDB } = require('../../startup/db');

describe('Business', () => {
	beforeEach(async () => {
		await connectDB();
		await saveBusiness();
	});

	afterEach(async () => {
		await Business.deleteMany();
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const businesses = await Business.find().countDocuments();
		expect(businesses).toBe(1);
	});
});
