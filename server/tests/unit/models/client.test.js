/**
 * @jest-environment node
 */
const { Client } = require('../../../models/client');
const { savedClient, unsavedClient } = require('../../seed/client');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Client', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await savedClient();
	});

	afterEach(async () => {
		await Client.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		const client = await Client.find().countDocuments();
		expect(client).toBe(1);
	});

	it('userId throws validationError if null', async () => {
		const client = await unsavedClient();
		client.userId = '';
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('userId throws validationError if invalid ObjectId', async () => {
		const client = await unsavedClient();
		client.userId = '65757fjfj4i4h48gh4';
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('name throws validationError if null', async () => {
		const client = await unsavedClient();
		client.name = '';
		await expect(client.save()).rejects.toThrow('Name required');
	});

	it('name throws validationError if > 255', async () => {
		const client = await unsavedClient();
		const name = new Array(27).join('longName55');
		client.name = name;
		await expect(client.save()).rejects.toThrow('Name too long');
	});

	it('name throws validationError if includes non standard characters', async () => {
		const client = await unsavedClient();
		const name = '<Client>!@£$%^>';
		client.name = name;
		await expect(client.save()).rejects.toThrow(
			'Name contains invalid character'
		);
	});

	it('name saved as lowercase', async () => {
		const client = await unsavedClient();
		client.name = 'LOWERCASE';
		await client.save();
		expect(client.name).toBe('lowercase');
	});

	// cEmail
	it('email throws validationError if null', async () => {
		const client = await unsavedClient();
		client.email = '';
		await expect(client.save()).rejects.toThrow('Email address required');
	});

	it('email throws validationError if > 255', async () => {
		const client = await unsavedClient();
		const name = new Array(27).join('longName55');
		client.email = name.concat('@email.com');
		await expect(client.save()).rejects.toThrow('Email address too long');
	});

	it('email throws validationError if not an valid format', async () => {
		const client = await unsavedClient();
		const name = '<Client>!@£$%^>';
		client.email = name;
		await expect(client.save()).rejects.toThrow('Check email address');
	});

	it('email saved as lowercase', async () => {
		const client = await unsavedClient();
		client.email = 'UPPERCASE@EMAIL.COM';
		await client.save();
		expect(client.email).toBe('uppercase@email.com');
	});

	// cPhone

	it('phone to throw validationError if empty', async () => {
		const phone = '';
		const client = await unsavedClient();
		client.phone = phone;
		await expect(client.save()).rejects.toThrow('Phone number required');
	});

	it('phone to throw validationError if too short', async () => {
		const phone = '123 678';
		const client = await unsavedClient();
		client.phone = phone;
		await expect(client.save()).rejects.toThrow('Check phone number');
	});

	it('phone to throw validationError if too long', async () => {
		const phone = '123 678 890 898098080';
		const client = await unsavedClient();
		client.phone = phone;
		await expect(client.save()).rejects.toThrow('Check phone number');
	});

	it('phone to throw validationError if any non digits', async () => {
		const phone = '(01278) 788788';
		const client = await unsavedClient();
		client.phone = phone;
		await expect(client.save()).rejects.toThrow('Check phone number');
	});

	// cAdd1
	it('add1 to throw validationError if empty', async () => {
		const add1 = '';
		const client = await unsavedClient();
		client.add1 = add1;
		await expect(client.save()).rejects.toThrow(
			'First line of address required'
		);
	});

	it('add1 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.add1 = add1;
		await client.save();
		expect(client.add1).toBe('13 top street');
	});

	it('add1 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.add1 = add1;
		await expect(client.save()).rejects.toThrow(
			'incorrect chatacter in address'
		);
	});

	// cAdd2
	it('add2 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.add2 = add1;
		await expect(client.save()).rejects.toThrow(
			'incorrect character in address'
		);
	});

	it('add2 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.add2 = add1;
		await client.save();
		expect(client.add2).toBe('13 top street');
	});

	// cAdd3
	it('add3 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.add3 = add1;
		await expect(client.save()).rejects.toThrow(
			'incorrect character in address'
		);
	});

	it('add3 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.add3 = add1;
		await client.save();
		expect(client.add3).toBe('13 top street');
	});
	// cPcode
	it('postcode to throw validationError if empty', async () => {
		const pcode = '';
		const client = await unsavedClient();
		client.postcode = pcode;
		await expect(client.save()).rejects.toThrow('Postcode required');
	});

	it('postcode to throw validationError if wrong format', async () => {
		const code = 'thwe1 229292';
		const client = await unsavedClient();
		client.postcode = code;
		await expect(client.save()).rejects.toThrow('Check postcode');
	});

	it('postcode saved as uppercase', async () => {
		const client = await unsavedClient();
		const code = 'wc1a 7yu';
		client.postcode = code;
		await client.save();
		expect(client.postcode).toBe('WC1A 7YU');
	});
});
