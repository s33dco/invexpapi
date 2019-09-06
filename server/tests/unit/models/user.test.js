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

	it('throws validationError if name > 32 characters', async () => {
		user = unsavedUser();
		user.name =
			'A very long name more than thirty two charcters in length.A very long name more than thirty two charcters in length';
		await expect(user.save()).rejects.toThrow('Name too long');
	});

	it('throws validationError if name empty', async () => {
		user = unsavedUser();
		user.name = '';
		await expect(user.save()).rejects.toThrow('Name required');
	});

	it('email to throw validationError if > 255 characters', async () => {
		user = await unsavedUser();
		const email = new Array(30).join('email@email.com');
		user.email = email;
		await expect(user.save()).rejects.toThrow('Email address too long');
	});

	it('throws validationError if name includes non standard characters', async () => {
		user = unsavedUser();
		user.name = '<>&$%^!@';
		await expect(user.save()).rejects.toThrow('contains blacklisted character');
	});

	it('throws validationError if email empty', async () => {
		user = unsavedUser();
		user.email = '';
		await expect(user.save()).rejects.toThrow('Email address required');
	});

	it('throws validationError if invalid email', async () => {
		user = unsavedUser();
		user.email = 'tony@tony';
		await expect(user.save()).rejects.toThrow('Check email address');
	});

	it('throws validationError if password empty', async () => {
		user = unsavedUser();
		user.password = '';
		await expect(user.save()).rejects.toThrow('User validation failed');
	});
});
