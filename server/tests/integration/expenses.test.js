/**
 * @jest-environment node
 */
const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const { Expense } = require('../../models/expense');
const { User } = require('../../models/user');
const app = require('../../app');

let cookies;
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

const getExpenses = () => {
	return request(app)
		.get('/api/expenses')
		.set('Cookie', cookies);
};

const getExpense = id => {
	return request(app)
		.get(`/api/expenses/${id}`)
		.set('Cookie', cookies);
};

const makeExpense = details => {
	return request(app)
		.post('/api/expenses')
		.set('Cookie', cookies)
		.send(details);
};

const getExpenseId = async () => {
	const res = await makeExpense(testExpense);
	const { _id } = res.body;
	return _id;
};

const makeExpenses = async n => {
	expenses = [];
	while (expenses.length < n) {
		expenses.push(testExpense);
	}
	expenses.forEach(async exp => {
		await makeExpense(exp);
	});
};

const postExpense = exp => {
	return request(app)
		.post('/api/expenses')
		.set('Cookie', cookies)
		.send(exp);
};

const updateExpense = (id, update) => {
	return request(app)
		.put(`/api/expenses/${id}`)
		.set('Cookie', cookies)
		.send(update);
};

const deleteExpense = id => {
	return request(app)
		.get(`/api/expenses/${id}`)
		.set('Cookie', cookies);
};

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
	await Expense.deleteMany();
	await User.deleteMany();
});

describe('GET /', () => {
	it('returns 404 and message if no users expenses found', async () => {
		const res = await getExpenses();
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'you have no expenses so far');
	});

	it('returns the users expenses', async () => {
		await makeExpenses(4);
		const res = await getExpenses();
		expect(res.status).toBe(200);
		expect(res.body).toBeArray();
		expect(res.body).toHaveLength(4);
	});

	it('returns 401 and message if not auth', async () => {
		cookies = '';
		const res = await getExpenses();
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('only returns logged in users clients', async () => {
		await makeExpenses(12);
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
		await makeExpenses(2);
		const res = await getExpenses();
		expect(res.status).toBe(200);
		expect(res.body).toBeArray();
		expect(res.body).toHaveLength(2);
	});
});

describe('POST /', () => {
	it('creates client details for user with valid details', async () => {
		const res = await postExpense(testExpense);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedExpense);
	});

	it("won't accept additional form fields", async () => {
		const res = await postExpense({
			...testExpense,
			fakeField: 'erroneous info'
		});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('returns 401 and error msg if no auth', async () => {
		cookies = 'iamafaketoken';
		const res = await postExpense(testExpense);
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
				const res = await postExpense(expense);
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
				const res = await postExpense(expense);
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
				const res = await postExpense(expense);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid amount is required');
			});
		});

		it('validates desc', async () => {
			const options = ['', '<%= %>', '!%^&*(_)'];
			options.forEach(async option => {
				const expense = { ...testExpense, desc: option };
				const res = await postExpense(expense);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid description is required');
			});
		});
	});
});

describe('PUT / :id', () => {
	it('updates an expense with valid input', async () => {
		const resA = await makeExpense(testExpense);
		const { _id } = resA.body;
		const res = await updateExpense(_id, {
			...testExpense,
			desc: 'this is a test'
		});
		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('desc', 'this is a test');
	});

	it('returns 404 if expense not found', async () => {
		const fake = mongoose.Types.ObjectId();
		const res = await updateExpense(fake, {
			...testExpense,
			desc: 'this is a test'
		});
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'expense details not found');
	});

	it('wont accept additional form fields', async () => {
		const resA = await makeExpense(testExpense);
		const { _id } = resA.body;
		const res = await updateExpense(_id, {
			...testExpense,
			fakeField: "You've Changed"
		});
		expect(res.status).toBe(400);
		expect(res.body).toHaveProperty('msg', '"fakeField" is not allowed');
	});

	it('returns 401 and error msg if no auth', async () => {
		const resA = await makeExpense(testExpense);
		const { _id } = resA.body;
		cookies = '';
		const res = await updateExpense(_id, testExpense);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if userId !== req.user.id', async () => {
		const resA = await makeExpense(testExpense);
		const { _id } = resA.body;
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
		const res = await updateExpense(_id, testExpense);
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
				const resA = await makeExpense(testExpense);
				const { _id } = resA.body;
				const res = await updateExpense(_id, expense);
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
				const resA = await makeExpense(testExpense);
				const { _id } = resA.body;
				const res = await updateExpense(_id, expense);
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
				const resA = await makeExpense(testExpense);
				const { _id } = resA.body;
				const res = await updateExpense(_id, expense);
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
				const resA = await makeExpense(testExpense);
				const { _id } = resA.body;
				const res = await updateExpense(_id, expense);
				expect(res.status).toBe(400);
				expect(res.body).toHaveProperty('msg', 'Valid description is required');
			});
		});
	});

	// describe(' GET / :id', () => {})
});

describe('GET / :id', () => {
	it('returns the correct expense record', async () => {
		const id = await getExpenseId();
		const res = await getExpense(id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedExpense);
	});

	it('returns 404 if no expense record', async () => {
		const id = await mongoose.Types.ObjectId();
		const res = await getExpense(id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'expense details not found');
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await getExpenseId();
		cookies = '';
		const res = await getExpense(id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await getExpenseId();
		const registerNewUser = () => {
			return request(app)
				.post('/api/users')
				.send({ ...registerUserDetails, email: 'john@newuser.com' });
		};
		const resA = await registerNewUser();
		cookies = resA.headers['set-cookie'];
		const res = await getExpense(id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});
});

describe('DELETE / :id', () => {
	it('returns the correct expense record', async () => {
		const id = await getExpenseId();
		const res = await deleteExpense(id);
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject(returnedExpense);
	});

	it('returns 404 if no expense record', async () => {
		const id = await mongoose.Types.ObjectId();
		const res = await deleteExpense(id);
		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('msg', 'expense details not found');
	});

	it('return a 401 and error msg if no auth', async () => {
		const id = await getExpenseId();
		cookies = '';
		const res = await deleteExpense(id);
		expect(res.status).toBe(401);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});

	it('returns 403 if usedId !== req.user.id', async () => {
		const id = await getExpenseId();
		const registerNewUser = () => {
			return request(app)
				.post('/api/users')
				.send({ ...registerUserDetails, email: 'john@newuser.com' });
		};
		const resA = await registerNewUser();
		cookies = resA.headers['set-cookie'];
		const res = await deleteExpense(id);
		expect(res.status).toBe(403);
		expect(res.body).toHaveProperty('msg', 'Not Authorised');
	});
});
