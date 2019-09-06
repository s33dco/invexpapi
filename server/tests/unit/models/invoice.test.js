/**
 * @jest-environment node
 */
const moment = require('moment');
const { Invoice } = require('../../../models/invoice');
const { Business } = require('../../../models/business');
const { User } = require('../../../models/user');
const { Client } = require('../../../models/client');
const { savedOwedInvoice, unsavedOwedInvoice } = require('../../seed/invoice');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Invoice', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await Invoice.deleteMany();
	});

	afterEach(async () => {
		await Invoice.deleteMany();
		await Business.deleteMany();
		await User.deleteMany();
		await Client.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	it('should save record with valid attributes', async () => {
		await savedOwedInvoice();
		const invoices = await Invoice.find().countDocuments();
		expect(invoices).toBe(1);
	});

	it('userId throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.userId = '';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('userId throws validationError if wrong format', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.userId = '64767642784jd';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('invNo throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.invNo = null;
		await expect(invoice.save()).rejects.toThrow('Invoice number is required');
	});

	it.skip('invNo throws validationError if invNo already used', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.invNo = 23;
		await invoice.save();
		const invoices = await Invoice.find().countDocuments();
		expect(invoices).toBe(1);
		const invoice2 = await unsavedOwedInvoice();
		invoice2.invNo = 23;
		await invoice2.save();
		await expect(invoice2.save()).rejects.toThrow(
			'Invoice number already in used.'
		);
	});
	it('invNo accepts different invNos', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.invNo = 23;
		await invoice.save();
		const invoice2 = await unsavedOwedInvoice();
		invoice2.invNo = 24;
		await invoice2.save();
		const invoices = await Invoice.find().countDocuments();
		expect(invoices).toBe(2);
	});

	it('invDate throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.invDate = '';
		await expect(invoice.save()).rejects.toThrow('Date is required');
	});

	it('invDate throws validationError if in the future', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.invDate = moment()
			.add(10, 'days')
			.startOf('day')
			.toISOString();
		await expect(invoice.save()).rejects.toThrow(
			'Date should be today or earlier'
		);
	});

	it('emailGreeting throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.emailGreeting = '';
		await expect(invoice.save()).rejects.toThrow('Greeting for email required');
	});

	it('emailGreeting throws validationError if uses invalid characters', async () => {
		const badGreetings = ['<>', '^%$£', '{}[]', '~`*'];
		badGreetings.forEach(async greeting => {
			const invoice = await unsavedOwedInvoice();
			invoice.emailGreeting = greeting;
			await expect(invoice.save()).rejects.toThrow('Invalid character used.');
		});
	});

	it('message throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.message = '';
		await expect(invoice.save()).rejects.toThrow('Message for email required');
	});

	it('message throws validationError if uses invalid characters', async () => {
		const badGreetings = ['<>', '^%$£', '{}[]', '~`*'];
		badGreetings.forEach(async greeting => {
			const invoice = await unsavedOwedInvoice();
			invoice.message = greeting;
			await expect(invoice.save()).rejects.toThrow('Invalid character used.');
		});
	});

	it('paid throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.paid = null;
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('datePaid throws validationError if in the future', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.datePaid = moment()
			.add(10, 'days')
			.startOf('day')
			.toISOString();
		await expect(invoice.save()).rejects.toThrow(
			'Date should be today or earlier'
		);
	});

	it('invoice.items.date throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.items[0].date = null;
		await expect(invoice.save()).rejects.toThrow('Date is required');
	});

	it('invoice.items.date throws validationError if date in future', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.items[0].date = moment()
			.add(31, 'days')
			.startOf('day')
			.toISOString();
		await expect(invoice.save()).rejects.toThrow(
			'Date should be today or earlier'
		);
	});

	it('invoice.items.desc throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.items[0].desc = '';
		await expect(invoice.save()).rejects.toThrow('Item description required');
	});

	it('invoice.items.desc throws validationError if includes invalid characters', async () => {
		const badOptions = ['<>', '^%$£', '{}[]', '~`*'];
		badOptions.forEach(async option => {
			const invoice = await unsavedOwedInvoice();
			invoice.items[0].desc = option;
			await expect(invoice.save()).rejects.toThrow('Invalid character used.');
		});
	});

	it('invoice.items.fee throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.items[0].fee = '';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('invoice.items.fee throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.items[0].fee = -10.0;
		await expect(invoice.save()).rejects.toThrow(
			'Check amount - value cannot be negative.'
		);
	});

	it('client.client_id throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.client_id = '';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('client.client_id throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.client_id = '65757fjfj4i4h48gh4';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('client.name throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.name = '';
		await expect(invoice.save()).rejects.toThrow('Name required');
	});

	it('client.name throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		const name = new Array(27).join('longName55');
		invoice.client.name = name;
		await expect(invoice.save()).rejects.toThrow('Name too long');
	});

	it('client.name throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		const name = '<Client>!@£$%^>';
		invoice.client.name = name;
		await expect(invoice.save()).rejects.toThrow(
			'Name contains invalid character'
		);
	});

	it('client.name saved as lowercase', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.name = 'LOWERCASE';
		await invoice.save();
		expect(invoice.client.name).toBe('lowercase');
	});

	it('client.email throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.email = '';
		await expect(invoice.save()).rejects.toThrow('Email address required');
	});

	it('client.email throws validationError if > 255', async () => {
		const invoice = await unsavedOwedInvoice();
		const email = new Array(27).join('longName55');
		invoice.client.email = email.concat('@email.com');
		await expect(invoice.save()).rejects.toThrow('Email address too long');
	});

	it('client.email throws validationError if not an valid format', async () => {
		const invoice = await unsavedOwedInvoice();
		const name = '<Client>!@£$%^>';
		invoice.client.email = name;
		await expect(invoice.save()).rejects.toThrow('Check email address');
	});

	it('client.phone to throw validationError if empty', async () => {
		const phone = '';
		const invoice = await unsavedOwedInvoice();
		invoice.client.phone = phone;
		await expect(invoice.save()).rejects.toThrow('Phone number required');
	});

	it('client.phone to throw validationError if too short', async () => {
		const phone = '123 678';
		const invoice = await unsavedOwedInvoice();
		invoice.client.phone = phone;
		await expect(invoice.save()).rejects.toThrow('Check phone number');
	});

	it('client.phone to throw validationError if too long', async () => {
		const phone = '123 678 789797 787878';
		const invoice = await unsavedOwedInvoice();
		invoice.client.phone = phone;
		await expect(invoice.save()).rejects.toThrow('Check phone number');
	});

	it('client.phone to throw validationError if any non digits', async () => {
		const phone = '(01234) 647387';
		const invoice = await unsavedOwedInvoice();
		invoice.client.phone = phone;
		await expect(invoice.save()).rejects.toThrow('Check phone number');
	});

	it('client.add1 to throw validationError if empty', async () => {
		const add1 = '';
		const invoice = await unsavedOwedInvoice();
		invoice.client.add1 = add1;
		await expect(invoice.save()).rejects.toThrow(
			'First line of address required'
		);
	});

	it('client.add1 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const invoice = await unsavedOwedInvoice();
		invoice.client.add1 = add1;
		await invoice.save();
		expect(invoice.client.add1).toBe('13 top street');
	});

	it('client.add1 to save in lowercase', async () => {
		const add1 = '<big>!ddd****';
		const invoice = await unsavedOwedInvoice();
		invoice.client.add1 = add1;
		await expect(invoice.save()).rejects.toThrow(
			'incorrect chatacter in address'
		);
	});

	it('client.add2 to save in lowercase', async () => {
		const add2 = '13 TOP STREET';
		const invoice = await unsavedOwedInvoice();
		invoice.client.add2 = add2;
		await invoice.save();
		expect(invoice.client.add2).toBe('13 top street');
	});

	it('client.add2 to save in lowercase', async () => {
		const add2 = '<big>!ddd****';
		const invoice = await unsavedOwedInvoice();
		invoice.client.add2 = add2;
		await expect(invoice.save()).rejects.toThrow(
			'incorrect character in address'
		);
	});

	it('client.postcode to throw validationError if empty', async () => {
		const pcode = '';
		const invoice = await unsavedOwedInvoice();
		invoice.client.postcode = pcode;
		await expect(invoice.save()).rejects.toThrow('Postcode required');
	});

	it('client.postcode to throw validationError if wrong format', async () => {
		const pcode = 'thwe1 229292';
		const invoice = await unsavedOwedInvoice();
		invoice.client.postcode = pcode;
		await expect(invoice.save()).rejects.toThrow('Check postcode');
	});

	it('client.postcode to save in uppercase', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.client.postcode = 'wc1x 2pp';
		await invoice.save();
		expect(invoice.client.postcode).toBe('WC1X 2PP');
	});

	it('business.business_id throws validationError if null', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.business_id = '';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('business.business_id throws validationError if invalid ObjectId', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.business_id = '65757fjfj4i4h48gh4';
		await expect(invoice.save()).rejects.toThrow('Invoice validation failed');
	});

	it('business.name throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.name = '';
		await expect(invoice.save()).rejects.toThrow('Business Name required');
	});

	it('business.name to throw validationError if > 255 characters', async () => {
		const invoice = await unsavedOwedInvoice();
		const name = new Array(27).join('longName55');
		invoice.business.name = name;
		await expect(invoice.save()).rejects.toThrow('Business Name too long');
	});

	it('business.name to save in lowercase', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.name = 'BIG BUSINESS';
		await invoice.save();
		expect(invoice.business.name).toBe('big business');
	});

	it('business.to throw validationError if includes non word characters', async () => {
		const names = ['<>', '|{}', '$_+=', '@!@', '-->'];
		let invoice;
		names.forEach(async name => {
			invoice = await unsavedOwedInvoice();
			invoice.business.name = name;
			await expect(invoice.save()).rejects.toThrow(
				'contains blacklisted character'
			);
		});
	});

	it('business.contact throws validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.contact = '';
		await expect(invoice.save()).rejects.toThrow('Contact Name required');
	});

	it('business.contact to throw validationError if > 255 characters', async () => {
		const invoice = await unsavedOwedInvoice();
		const contact = new Array(27).join('longcontact55');
		invoice.business.contact = contact;
		await expect(invoice.save()).rejects.toThrow('Contact Name too long');
	});

	it('business.contact to save in lowercase', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.contact = 'BIG BUSINESS';
		await invoice.save();
		expect(invoice.business.contact).toBe('big business');
	});

	it('business.contact to throw validationError if includes non word characters', async () => {
		const contacts = ['<>', '|{}', '$_+=', '@!@', '-->'];
		let invoice;
		contacts.forEach(async contact => {
			invoice = await unsavedOwedInvoice();
			invoice.business.contact = contact;
			await expect(invoice.save()).rejects.toThrow(
				'contains invalid character'
			);
		});
	});

	it('business.contact accepts hypenated punctuated names', async () => {
		const name = "Mr. John O'Flaherty-Mincepie Esq. ";
		const invoice = await unsavedOwedInvoice();
		invoice.business.contact = name;
		await invoice.save();
		const invoices = await Invoice.find().countDocuments();
		expect(invoices).toBe(1);
	});

	it('business.email to throw validationError if empty', async () => {
		const email = '';
		const invoice = await unsavedOwedInvoice();
		invoice.business.email = email;
		await expect(invoice.save()).rejects.toThrow('Email address required');
	});

	it('business.email to throw validationError if invalid email address.', async () => {
		const emails = ['@bmail', 'del@del', 'del[at]del[dot]com', 'del@delcom'];
		let invoice;
		emails.forEach(async email => {
			invoice = await unsavedOwedInvoice();
			invoice.business.email = email;
			await expect(invoice.save()).rejects.toThrow('Check email address');
		});
	});

	it('business.email to throw validationError if > 255 characters', async () => {
		const invoice = await unsavedOwedInvoice();
		const email = new Array(30).join('email@email.com');
		invoice.business.email = email;
		await expect(invoice.save()).rejects.toThrow('Email address too long');
	});

	it('business.email saved as lowercase', async () => {
		const invoice = await unsavedOwedInvoice();
		const email = 'MYEMAILADDRESS@EMAILPROVIDER.COM';
		invoice.business.email = email;
		await invoice.save();
		expect(invoice.business.email).toBe('myemailaddress@emailprovider.com');
	});

	it('business.phone to throw validationError if empty', async () => {
		const phone = '';
		const invoice = await unsavedOwedInvoice();
		invoice.business.phone = phone;
		await expect(invoice.save()).rejects.toThrow('Phone number required');
	});

	it('business.phone to throw validationError if too short', async () => {
		const phone = '1342';
		const invoice = await unsavedOwedInvoice();
		invoice.business.phone = phone;
		await expect(invoice.save()).rejects.toThrow('check phone number');
	});

	it('business.phone to throw validationError if too long', async () => {
		const phone = '1342 78977 7987979798787';
		const invoice = await unsavedOwedInvoice();
		invoice.business.phone = phone;
		await expect(invoice.save()).rejects.toThrow('check phone number');
	});

	it('business.phone to throw validationError if any non digits', async () => {
		const phone = '(01273)-789779';
		const invoice = await unsavedOwedInvoice();
		invoice.business.phone = phone;
		await expect(invoice.save()).rejects.toThrow('check phone number');
	});

	it('business.add1 to throw validationError if empty', async () => {
		const add1 = '';
		const invoice = await unsavedOwedInvoice();
		invoice.business.add1 = add1;
		await expect(invoice.save()).rejects.toThrow(
			'First line of address required'
		);
	});

	it('business.add1 to save in lowercase', async () => {
		const add1 = '13 TOP STREET';
		const invoice = await unsavedOwedInvoice();
		invoice.business.add1 = add1;
		await invoice.save();
		expect(invoice.business.add1).toBe('13 top street');
	});

	it('business.add1 to save in lowercase', async () => {
		const add1 = '<big>!ddd****';
		const invoice = await unsavedOwedInvoice();
		invoice.business.add1 = add1;
		await expect(invoice.save()).rejects.toThrow(
			'incorrect character in address'
		);
	});

	it('business.add2 to save in lowercase', async () => {
		const add2 = '13 TOP STREET';
		const invoice = await unsavedOwedInvoice();
		invoice.business.add2 = add2;
		await invoice.save();
		expect(invoice.business.add2).toBe('13 top street');
	});

	it('business.add2 to save in lowercase', async () => {
		const add2 = '<big>!ddd****';
		const invoice = await unsavedOwedInvoice();
		invoice.business.add2 = add2;
		await expect(invoice.save()).rejects.toThrow(
			'incorrect character in address'
		);
	});

	it('business.postcode to throw validationError if empty', async () => {
		const pcode = '';
		const invoice = await unsavedOwedInvoice();
		invoice.business.postcode = pcode;
		await expect(invoice.save()).rejects.toThrow('Postcode required');
	});

	it('business.postcode to throw validationError if wrong format', async () => {
		const pcode = 'thwe1 229292';
		const invoice = await unsavedOwedInvoice();
		invoice.business.postcode = pcode;
		await expect(invoice.save()).rejects.toThrow('Check postcode');
	});

	it('business.postcode to save in uppercase', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.postcode = 'wc1x 2pp';
		await invoice.save();
		expect(invoice.business.postcode).toBe('WC1X 2PP');
	});

	it('business.bankName to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.bankName = '';
		await expect(invoice.save()).rejects.toThrow('Bank name required');
	});

	it('business.bankName to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.bankName = 'The! CO%OP bank';
		await expect(invoice.save()).rejects.toThrow(
			'incorrect chatacter in Bank name'
		);
	});

	it('bankName saved as lowercase', async () => {
		const invoice = await unsavedOwedInvoice();
		const code = 'COOP BANK';
		invoice.business.bankName = code;
		await invoice.save();
		expect(invoice.business.bankName).toBe('coop bank');
	});

	it('business.sortCode to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.sortCode = '';
		await expect(invoice.save()).rejects.toThrow('Sort code required');
	});

	it('business.sortCode to throw validationError if non standard characters', async () => {
		const code = '23/23/23';
		const invoice = await unsavedOwedInvoice();
		invoice.business.sortCode = code;
		await expect(invoice.save()).rejects.toThrow('check sort code');
	});

	it('business.accountNo to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.accountNo = '';
		await expect(invoice.save()).rejects.toThrow('Account number required');
	});

	it('business.accountNo to throw validationError too many digits', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.accountNo = '1234571623t71625371';
		await expect(invoice.save()).rejects.toThrow('check account number');
	});

	it('business.utr to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.utr = '';
		await expect(invoice.save()).rejects.toThrow('UTR required');
	});

	it('business.utr to throw validationError too many digits', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.utr = '1234571623t71625374435351';
		await expect(invoice.save()).rejects.toThrow('check UTR');
	});

	it('business.utr to throw validationError too few digits', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.utr = '1234';
		await expect(invoice.save()).rejects.toThrow('check UTR');
	});

	it('business.terms to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.terms = '';
		await expect(invoice.save()).rejects.toThrow('terms required');
	});

	it('business.terms to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.terms = '<>^&%';
		await expect(invoice.save()).rejects.toThrow('invalid character in terms');
	});

	it('business.terms to be downcased', async () => {
		const terms =
			"Thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!";
		const invoice = await unsavedOwedInvoice();
		invoice.business.terms = terms;
		expect(invoice.business.terms).toBe(
			"thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!"
		);
	});

	it('business.farewell to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.farewell = '';
		await expect(invoice.save()).rejects.toThrow('farewell required');
	});

	it('business.farewell to throw validationError if empty', async () => {
		const invoice = await unsavedOwedInvoice();
		invoice.business.farewell = '<>^&%';
		await expect(invoice.save()).rejects.toThrow(
			'invalid chatacter in farewell'
		);
	});

	it('business.farewell to be downcased', async () => {
		const farewell =
			"Thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!";
		const invoice = await unsavedOwedInvoice();
		invoice.business.farewell = farewell;
		expect(invoice.business.farewell).toBe(
			"thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!"
		);
	});
});
