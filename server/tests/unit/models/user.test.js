/**
 * @jest-environment node
 */
const { User } = require('../../../models/user');
const { savedUser, unsavedUser } = require('../../seed/user');
const { connectDB, disconnectDB } = require('../../../startup/db');

let user;

describe('User', () => {
	beforeEach(async () => {
		await connectDB();
		user = await savedUser();
	});

	afterEach(async () => {
		await User.deleteMany();
		await disconnectDB();
	});

	it('should save a user with valid details', async () => {
		const users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should save a user with valid details', async () => {
		let users = await User.find().countDocuments();
		expect(users).toBe(1);
		user = unsavedUser();
		user.password = 'tooshort';
		users = await User.find().countDocuments();
		expect(users).toBe(1);
	});

	it('should reject paswords < 10', async () => {
		const { email } = user;
		const found = await User.findByEmail(email);
		expect(found._id).toEqual(user._id);
	});
});
