/**
 * @jest-environment node
 */
const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const { Expense } = require('../../models/expense');
const { User } = require('../../models/user');
const app = require('../../app');

let authToken;
let expenses;

const registerUserDetails = {
	name: 's33dCode',
	email: 'code@s33d.co',
	password: '1@P!a$£$word'
};

const testExpense = {
	date: moment()
		.startOf('day')
		.toISOString(),
	category: 'Office, property and equipment',
	amount: 123.23,
	desc: 'some paper and stationary supplies'
};

const day = moment()
	.startOf('day')
	.toISOString();

const returnedExpense = {
	date: `${day}`,
	category: 'Office, property and equipment',
	amount: { $numberDecimal: '123.23' },
	desc: 'some paper and stationary supplies'
};

const registerUser = details => {
	return request(app)
		.post('/api/users')
		.send(details);
};

const getExpenses = auth => {
	return request(app)
		.get('/api/expenses')
		.set('x-auth-token', auth);
};

const getExpense = (auth, id) => {
	return request(app)
		.get(`/api/expenses/${id}`)
		.set('x-auth-token', auth);
};

const makeExpense = (auth, details) => {
	return request(app)
		.post('/api/expenses')
		.set('x-auth-token', auth)
		.send(details);
};

const getExpenseId = async (auth, details) => {
	const res = await makeExpense(auth, details);
	const { _id } = res.body;
	return _id;
};

const makeExpenses = async (auth, n) => {
	expenses = [];
	while (expenses.length < n) {
		expenses.push(testExpense);
	}
	expenses.forEach(async exp => {
		await makeExpense(auth, exp);
	});
};

const postExpense = (auth, exp) => {
	return request(app)
		.post('/api/expenses')
		.set('x-auth-token', auth)
		.send(exp);
};

const updateExpense = (auth, id, update) => {
	return request(app)
		.put(`/api/expenses/${id}`)
		.set('x-auth-token', auth)
		.send(update);
};

const deleteExpense = (auth, id) => {
	return request(app)
		.get(`/api/expenses/${id}`)
		.set('x-auth-token', auth);
};

beforeEach(async () => {
	const res = await registerUser(registerUserDetails);
	const { token } = res.body;
	authToken = token;
});

afterEach(async () => {
	await Expense.deleteMany();
	await User.deleteMany();
});

describe('expenses endpoints', () => {
	describe('GET /', () => {
		it('returns 404 and message if no users expenses found', async () => {
			const res = await getExpenses(authToken);
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('msg', 'you have no expenses so far');
		});

		it('returns the users expenses', async () => {
			await makeExpenses(authToken, 4);
			const res = await getExpenses(authToken);
			expect(res.status).toBe(200);
			expect(res.body).toBeArray();
			expect(res.body).toHaveLength(4);
		});

		it('returns 401 and message if no token', async () => {
			const res = await getExpenses('');
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});
		it('returns 403 and message if invalid token', async () => {
			const res = await getExpenses('878923yh4k2h34k2h34hk234j23h4kj2h34');
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('only returns logged in users clients', async () => {
			await makeExpenses(authToken, 12);
			const response = await registerUser({
				name: 'A Different Drummer',
				email: 'drumming@differently.com',
				password: '1@P!a$£$word'
			});
			const newAuth = response.body.token;
			await makeExpenses(newAuth, 2);
			const res = await getExpenses(newAuth);
			expect(res.status).toBe(200);
			expect(res.body).toBeArray();
			expect(res.body).toHaveLength(2);
		});
	});

	describe('POST /', () => {
		it('creates client details for user with valid details', async () => {
			const res = await postExpense(authToken, testExpense);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject(returnedExpense);
		});

		it("won't accept additional form fields", async () => {
			const res = await postExpense(authToken, {
				...testExpense,
				fakeField: 'erroneous info'
			});
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
		});

		it('returns 403 if invalid token', async () => {
			const res = await postExpense('iamafaketoken', testExpense);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('returns 401 if no token', async () => {
			const res = await postExpense('', testExpense);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		describe('validate form values', () => {
			it('validates date', async () => {
				const options = [
					'$324',
					'',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					moment()
						.add(20, 'days')
						.startOf('day')
						.toISOString()
				];
				options.forEach(async option => {
					const expense = { ...testExpense, date: option };
					const res = await postExpense(authToken, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'A date is required, today or earlier'
					);
				});
			});

			it('validates input', async () => {
				const options = [
					'$324',
					'',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					'non value'
				];
				options.forEach(async option => {
					const expense = { ...testExpense, category: option };
					const res = await postExpense(authToken, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'select a valid category');
				});
			});

			it('validates amount', async () => {
				const options = [
					'$324',
					'',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					'non value'
				];
				options.forEach(async option => {
					const expense = { ...testExpense, amount: option };
					const res = await postExpense(authToken, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'Valid amount is required');
				});
			});

			it('validates desc', async () => {
				const options = ['', '<%= %>', '!%^&*(_)'];
				options.forEach(async option => {
					const expense = { ...testExpense, desc: option };
					const res = await postExpense(authToken, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid description is required'
					);
				});
			});
		});
	});

	describe('PUT / :id', () => {
		it('updates an expense with valid input', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await updateExpense(authToken, id, {
				...testExpense,
				desc: 'this is a test'
			});
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('desc', 'this is a test');
		});

		it('returns 404 if expense not found', async () => {
			const fake = mongoose.Types.ObjectId();
			const res = await updateExpense(authToken, fake, {
				...testExpense,
				desc: 'this is a test'
			});
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('msg', 'expense details not found');
		});

		it('wont accept additional form fields', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await updateExpense(authToken, id, {
				...testExpense,
				fakeField: "You've Changed"
			});
			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
		});

		it('returns 401 and error msg if no auth', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await updateExpense('', id, testExpense);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('returns 403 if userId !== req.user.id', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const diffUser = await registerUser({
				name: 'A Different Drummer',
				email: 'drumming@differently.com',
				password: '1@P!a$£$word'
			});
			const diffToken = diffUser.body.token;
			const res = await updateExpense(diffToken, id, testExpense);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		describe('validates form values', () => {
			it('validates date', async () => {
				const options = [
					'$324',
					'',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					moment()
						.add(20, 'days')
						.startOf('day')
						.toISOString()
				];
				options.forEach(async option => {
					const expense = { ...testExpense, date: option };
					const id = await getExpenseId(authToken, testExpense);
					const res = await updateExpense(authToken, id, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'A date is required, today or earlier'
					);
				});
			});

			it('validates category', async () => {
				const options = [
					'$324',
					'a rougue category',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					1,
					moment()
						.add(20, 'days')
						.startOf('day')
						.toISOString()
				];
				options.forEach(async option => {
					const expense = { ...testExpense, category: option };
					const id = await getExpenseId(authToken, testExpense);
					const res = await updateExpense(authToken, id, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'select a valid category');
				});
			});

			it('validates amount', async () => {
				const options = [
					'$324',
					'a rougue category',
					'<%= %>',
					'!%^&*(_)',
					'pocket money',
					'-12',
					-12,
					moment()
						.add(20, 'days')
						.startOf('day')
						.toISOString()
				];
				options.forEach(async option => {
					const expense = { ...testExpense, amount: option };
					const id = await getExpenseId(authToken, testExpense);
					const res = await updateExpense(authToken, id, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty('msg', 'Valid amount is required');
				});
			});

			it('validates desc', async () => {
				const options = [
					'<%= %>',
					'!%^&*(_)',
					1,
					moment()
						.add(20, 'days')
						.startOf('day')
						.toISOString()
				];
				options.forEach(async option => {
					const expense = { ...testExpense, desc: option };
					const id = await getExpenseId(authToken, testExpense);
					const res = await updateExpense(authToken, id, expense);
					expect(res.status).toBe(400);
					expect(res.body).toHaveProperty(
						'msg',
						'Valid description is required'
					);
				});
			});
		});
	});

	describe('GET / :id', () => {
		it('returns the correct expense record', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await getExpense(authToken, id);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject(returnedExpense);
		});

		it('returns 404 if no expense record', async () => {
			const id = await mongoose.Types.ObjectId();
			const res = await getExpense(authToken, id);
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('msg', 'expense details not found');
		});

		it('return a 401 and error msg if no auth', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await getExpense('', id);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('returns 403 if usedId !== req.user.id', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const diffUser = await registerUser({
				name: 'A Different Drummer',
				email: 'drumming@differently.com',
				password: '1@P!a$£$word'
			});
			const diffToken = diffUser.body.token;
			const res = await getExpense(diffToken, id);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});
	});

	describe('DELETE / :id', () => {
		it('returns the correct expense record', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await deleteExpense(authToken, id);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject(returnedExpense);
		});

		it('returns 404 if no expense record', async () => {
			const id = await mongoose.Types.ObjectId();
			const res = await deleteExpense(authToken, id);
			expect(res.status).toBe(404);
			expect(res.body).toHaveProperty('msg', 'expense details not found');
		});

		it('return a 401 and error msg if no auth', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const res = await deleteExpense('', id);
			expect(res.status).toBe(401);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});

		it('returns 403 if usedId !== req.user.id', async () => {
			const id = await getExpenseId(authToken, testExpense);
			const diffUser = await registerUser({
				name: 'A Different Drummer',
				email: 'drumming@differently.com',
				password: '1@P!a$£$word'
			});
			const diffToken = diffUser.body.token;
			const res = await deleteExpense(diffToken, id);
			expect(res.status).toBe(403);
			expect(res.body).toHaveProperty('msg', 'Not Authorised');
		});
	});
});
