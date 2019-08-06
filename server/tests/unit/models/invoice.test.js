/**
 * @jest-environment node
 */
const { Invoice } = require('../../../models/invoice');
const { Business } = require('../../../models/business');
const { User } = require('../../../models/user');
const { Client } = require('../../../models/client');
const { savedOwedInvoice } = require('../../seed/invoice');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Invoice', () => {
	beforeEach(async () => {
		await connectDB();
		await savedOwedInvoice();
	});

	afterEach(async () => {
		await Invoice.deleteMany();
		await Business.deleteMany();
		await User.deleteMany();
		await Client.deleteMany();
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const invoices = await Invoice.find().countDocuments();
		expect(invoices).toBe(1);
	});
});
