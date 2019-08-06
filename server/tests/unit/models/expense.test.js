/**
 * @jest-environment node
 */
const { Expense } = require('../../../models/expense');
const { savedExpense } = require('../../seed/expense');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Expense', () => {
	beforeEach(async () => {
		await connectDB();
		await savedExpense();
	});

	afterEach(async () => {
		await Expense.deleteMany();
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const expenses = await Expense.find().countDocuments();
		expect(expenses).toBe(1);
	});
});
