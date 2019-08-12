/**
 * @jest-environment node
 */
const { Business } = require('../../../models/business');
const { savedBusiness } = require('../../seed/business');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Business', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await connectDB();
		await savedBusiness();
	});

	afterEach(async () => {
		await Business.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const businesses = await Business.find().countDocuments();
		expect(businesses).toBe(1);
	});
});
