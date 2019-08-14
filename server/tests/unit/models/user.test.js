/**
 * @jest-environment node
 */
const { User } = require('../../../models/user');
const { savedUser, unsavedUser } = require('../../seed/user');
const { connectDB, disconnectDB } = require('../../../startup/db');

let user;

describe('User', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await connectDB();
		user = await savedUser();
	});

	afterEach(async () => {
		await User.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save a user with valid details', async () => {
		const users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with name > 20 characters', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.name = 'A very long name more than twenty charcters';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with an empty name', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.name = '';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with an empty email', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.email = '';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with an empty password', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.password = '';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with a password < 8 characters', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.password = '1234567';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should not save a user with a password > 255 characters', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.password = new Array(258).join('a');
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});
});
