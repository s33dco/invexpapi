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

	it('cName throws validationError if null', async () => {
		const client = await unsavedClient();
		client.cName = '';
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cName throws validationError if > 255', async () => {
		const client = await unsavedClient();
		const name = new Array(27).join('longName55');
		client.cName = name;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cName throws validationError if includes non standard characters', async () => {
		const client = await unsavedClient();
		const name = '<Client>!@£$%^>';
		client.cName = name;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cName saved as lowercase', async () => {
		const client = await unsavedClient();
		client.cName = 'LOWERCASE';
		await client.save();
		expect(client.cName).toBe('lowercase');
	});

	// cEmail
	it('cEmail throws validationError if null', async () => {
		const client = await unsavedClient();
		client.cEmail = '';
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cEmail throws validationError if > 255', async () => {
		const client = await unsavedClient();
		const name = new Array(27).join('longName55');
		client.cEmail = name.concat('@email.com');
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cEmail throws validationError if not an valid format', async () => {
		const client = await unsavedClient();
		const name = '<Client>!@£$%^>';
		client.cEmail = name;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cEmail saved as lowercase', async () => {
		const client = await unsavedClient();
		client.cEmail = 'UPPERCASE@EMAIL.COM';
		await client.save();
		expect(client.cEmail).toBe('uppercase@email.com');
	});

	// cPhone

	it('cPhone to throw validationError if empty', async () => {
		const phone = '';
		const client = await unsavedClient();
		client.cPhone = phone;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cPhone to throw validationError if too short', async () => {
		const phone = '123 678';
		const client = await unsavedClient();
		client.cPhone = phone;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cPhone to throw validationError if too long', async () => {
		const phone = '123 678 890 898098080';
		const client = await unsavedClient();
		client.cPhone = phone;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cPhone to throw validationError if any non digits', async () => {
		const phone = '(01278) 788788';
		const client = await unsavedClient();
		client.cPhone = phone;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	// cAdd1
	it('cAdd1 to throw validationError if empty', async () => {
		const add1 = '';
		const client = await unsavedClient();
		client.cAdd1 = add1;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cAdd1 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.cAdd1 = add1;
		await client.save();
		expect(client.cAdd1).toBe('13 top street');
	});

	it('cAdd1 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.cAdd1 = add1;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	// cAdd2
	it('cAdd2 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.cAdd2 = add1;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cAdd2 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.cAdd2 = add1;
		await client.save();
		expect(client.cAdd2).toBe('13 top street');
	});

	// cAdd3
	it('cAdd3 to throw validationError if include non standard characters', async () => {
		const add1 = '<big>!ddd****';
		const client = await unsavedClient();
		client.cAdd3 = add1;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('cAdd3 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const client = await unsavedClient();
		client.cAdd3 = add1;
		await client.save();
		expect(client.cAdd3).toBe('13 top street');
	});
	// cPcode
	it('bPcode to throw validationError if empty', async () => {
		const pcode = '';
		const client = await unsavedClient();
		client.cPcode = pcode;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('bPcode to throw validationError if wrong format', async () => {
		const code = 'thwe1 229292';
		const client = await unsavedClient();
		client.cPcode = code;
		await expect(client.save()).rejects.toThrow('Client validation failed');
	});

	it('bPcode saved as uppercase', async () => {
		const client = await unsavedClient();
		const code = 'wc1a 7yu';
		client.cPcode = code;
		await client.save();
		expect(client.cPcode).toBe('WC1A 7YU');
	});
});
