/**
 * @jest-environment node
 */
const moment = require('moment');
const { Expense } = require('../../../models/expense');
const { savedExpense, unsavedExpense } = require('../../seed/expense');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Expense', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await connectDB();
		await savedExpense();
	});

	afterEach(async () => {
		await Expense.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const expenses = await Expense.find().countDocuments();
		expect(expenses).toBe(1);
	});

	it('userId throws validationError if null ObjectId', async () => {
		const expense = await unsavedExpense();
		expense.userId = null;
		await expect(expense.save()).rejects.toThrow('Expense validation failed');
	});

	it('userId throws validationError if invalid ObjectId', async () => {
		const expense = await unsavedExpense();
		expense.userId = '65757fjfj4i4h48gh4';
		await expect(expense.save()).rejects.toThrow('Expense validation failed');
	});

	it('date throws validationError if empty', async () => {
		const expense = await unsavedExpense();
		expense.date = '';
		await expect(expense.save()).rejects.toThrow('Date is required');
	});

	it('date throws validationError if in the future', async () => {
		const expense = await unsavedExpense();
		expense.date = moment()
			.add(10, 'days')
			.startOf('day')
			.toISOString();
		await expect(expense.save()).rejects.toThrow(
			'Date should be today or earlier'
		);
	});

	it('category throws validationError if empty', async () => {
		const expense = await unsavedExpense();
		expense.category = '';
		await expect(expense.save()).rejects.toThrow('Category required');
	});

	it('category throws validationError if empty', async () => {
		const expense = await unsavedExpense();
		expense.category = 'nor a real choice';
		await expect(expense.save()).rejects.toThrow('Select a valid option');
	});

	it('amount throws validationError if null', async () => {
		const expense = await unsavedExpense();
		expense.amount = null;
		await expect(expense.save()).rejects.toThrow('Amount required');
	});

	it('amount throws validationError if < 0', async () => {
		const expense = await unsavedExpense();
		expense.amount = -12.0;
		await expect(expense.save()).rejects.toThrow(
			'Check amount - value cannot be negative'
		);
	});

	it('desc throws validationError if null', async () => {
		const expense = await unsavedExpense();
		expense.desc = '';
		await expect(expense.save()).rejects.toThrow('Description required');
	});

	it('desc throws validationError if has invalid charcaters', async () => {
		const names = ['<>', '|{}', '$_+=', '@!@', '-->'];
		let expense;
		names.forEach(async desc => {
			expense = await unsavedExpense();
			expense.desc = desc;
			await expect(expense.save()).rejects.toThrow('Invalid character used');
		});
	});
});
