/**
 * @jest-environment node
 */
const { Business } = require('../../../models/business');
const { savedBusiness, unsavedBusiness } = require('../../seed/business');
const { connectDB, disconnectDB } = require('../../../startup/db');

describe('Business', () => {
	beforeAll(async () => {
		await connectDB();
	});

	beforeEach(async () => {
		await savedBusiness();
	});

	afterEach(async () => {
		await Business.deleteMany();
	});

	afterAll(async () => {
		await disconnectDB();
	});

	describe('business model', () => {
		it('should save record with valid attributes', async () => {
			const businesses = await Business.find().countDocuments();
			expect(businesses).toBe(1);
		});

		it('userId throws validationError if null', async () => {
			const business = await unsavedBusiness();
			business.userId = '';
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('userId throws validationError if invalid ObjectId', async () => {
			const business = await unsavedBusiness();
			business.userId = '65757fjfj4i4h48gh4';
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('useMileage needs to be a boolean value', async () => {
			let businesses = await Business.find().countDocuments();
			expect(businesses).toBe(1);
			await unsavedBusiness().save();
			const b2 = await unsavedBusiness();
			b2.useMileage = false;
			await b2.save();
			businesses = await Business.find().countDocuments();
			expect(businesses).toBe(3);
		});

		it('useMileage throws validationError if not boolean', async () => {
			const business = await unsavedBusiness();
			business.useMileage = '';
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('name to throw validationError if empty string', async () => {
			const business = await unsavedBusiness();
			business.name = '';
			await expect(business.save()).rejects.toThrow('Business Name required');
		});

		it('name to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const name = new Array(27).join('longName55');
			business.name = name;
			await expect(business.save()).rejects.toThrow('Business Name too long');
		});

		it('name saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const name = 'LoWeRCaSE';
			business.name = name;
			await business.save();
			expect(business.name).toBe('lowercase');
		});

		it('name to throw validationError if includes non word characters', async () => {
			const names = ['<>', '|{}', '$_+=', '@!@', '-->'];
			let business;
			names.forEach(async name => {
				business = await unsavedBusiness();
				business.name = name;
				await expect(business.save()).rejects.toThrow(
					'contains blacklisted character'
				);
			});
		});

		it('contact must be present', async () => {
			const name = '';
			const business = await unsavedBusiness();
			business.contact = name;
			await expect(business.save()).rejects.toThrow('Contact Name required');
		});

		it('contact to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const name = new Array(27).join('longName55');
			business.contact = name;
			await expect(business.save()).rejects.toThrow('Contact Name too long');
		});

		it('contact is saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const name = 'MR UPPERCASE';
			business.contact = name;
			await business.save();
			expect(business.contact).toBe('mr uppercase');
		});

		it('contact to throw validationError if includes non word characters', async () => {
			const names = ['<>', '|{}', '$_+=', '@!@', '-->', '?%^&£'];
			let business;
			names.forEach(async name => {
				business = await unsavedBusiness();
				business.contact = name;
				await expect(business.save()).rejects.toThrow(
					'contains blacklisted character'
				);
			});
		});

		it('contact accepts hypenated punctuated names', async () => {
			let businesses = await Business.find().countDocuments();
			expect(businesses).toBe(1);
			const name = "Mr. John O'Flaherty-Mincepie Esq. ";
			const business = await unsavedBusiness();
			business.contact = name;
			await business.save();
			businesses = await Business.find().countDocuments();
			expect(businesses).toBe(2);
		});

		it('email to throw validationError if empty', async () => {
			const email = '';
			const business = await unsavedBusiness();
			business.email = email;
			await expect(business.save()).rejects.toThrow('Email address required');
		});

		it('email to throw validationError if invalid email address.', async () => {
			const emails = ['@bmail', 'del@del', 'del[at]del[dot]com', 'del@delcom'];
			let business;
			emails.forEach(async email => {
				business = await unsavedBusiness();
				business.email = email;
				await expect(business.save()).rejects.toThrow('Check email address');
			});
		});

		it('email to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const email = new Array(30).join('email@email.com');
			business.email = email;
			await expect(business.save()).rejects.toThrow('Email address too long');
		});

		it('email saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const email = 'MYEMAILADDRESS@EMAILPROVIDER.COM';
			business.email = email;
			await business.save();
			expect(business.email).toBe('myemailaddress@emailprovider.com');
		});

		it('phone to throw validationError if empty', async () => {
			const phone = '';
			const business = await unsavedBusiness();
			business.phone = phone;
			await expect(business.save()).rejects.toThrow('Phone number required');
		});

		it('phone to throw validationError if too short', async () => {
			const phone = '123 678';
			const business = await unsavedBusiness();
			business.phone = phone;
			await expect(business.save()).rejects.toThrow('check phone number');
		});

		it('phone to throw validationError if too long', async () => {
			const phone = '123 678 890 898098080';
			const business = await unsavedBusiness();
			business.phone = phone;
			await expect(business.save()).rejects.toThrow('check phone number');
		});

		it('phone to throw validationError if any non digits', async () => {
			const phone = '(01278) 788788';
			const business = await unsavedBusiness();
			business.phone = phone;
			await expect(business.save()).rejects.toThrow('check phone number');
		});

		it('add1 to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.add1 = add1;
			await expect(business.save()).rejects.toThrow(
				'First line of address required'
			);
		});

		it('add1 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.add1 = add1;
			await business.save();
			expect(business.add1).toBe('13 top street');
		});

		it('add1 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.add1 = add1;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in address'
			);
		});

		it('add2 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.add2 = add1;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in address'
			);
		});

		it('add2 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.add2 = add1;
			await business.save();
			expect(business.add2).toBe('13 top street');
		});

		it('add3 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.add3 = add1;
			await business.save();
			expect(business.add3).toBe('13 top street');
		});

		it('add3 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.add3 = add1;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in address'
			);
		});

		it('postcode to throw validationError if empty', async () => {
			const pcode = '';
			const business = await unsavedBusiness();
			business.postcode = pcode;
			await expect(business.save()).rejects.toThrow('Postcode required');
		});

		it('postcode to throw validationError if wrong format', async () => {
			const code = 'thwe1 229292';
			const business = await unsavedBusiness();
			business.postcode = code;
			await expect(business.save()).rejects.toThrow('check postcode');
		});

		it('postcode saved as uppercase', async () => {
			const business = await unsavedBusiness();
			const code = 'wc1a 7yu';
			business.postcode = code;
			await business.save();
			expect(business.postcode).toBe('WC1A 7YU');
		});

		it('bankName to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.bankName = add1;
			await expect(business.save()).rejects.toThrow('Bank name required');
		});

		it('bankName to throw validationError if non standard characters', async () => {
			const add1 = 'The! CO%OP bank';
			const business = await unsavedBusiness();
			business.bankName = add1;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in Bank name'
			);
		});

		it('bankName saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const code = 'COOP BANK';
			business.bankName = code;
			await business.save();
			expect(business.bankName).toBe('coop bank');
		});

		it('sortCode to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.sortCode = add1;
			await expect(business.save()).rejects.toThrow('Sort code required');
		});

		it('sortCode to throw validationError if non standard characters', async () => {
			const add1 = '23/23/23';
			const business = await unsavedBusiness();
			business.sortCode = add1;
			await expect(business.save()).rejects.toThrow('check sort code');
		});

		it('accountNo to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.accountNo = add1;
			await expect(business.save()).rejects.toThrow('Account number required');
		});

		it('accountNo to throw validationError if too many digits', async () => {
			const add1 = '129837192837';
			const business = await unsavedBusiness();
			business.accountNo = add1;
			await expect(business.save()).rejects.toThrow('check account nummber');
		});

		it('utr to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.utr = add1;
			await expect(business.save()).rejects.toThrow('UTR required');
		});

		it('utr to throw validationError if too many digits', async () => {
			const utr = '987654321987654321';
			const business = await unsavedBusiness();
			business.utr = utr;
			await expect(business.save()).rejects.toThrow('check UTR');
		});

		it('terms to throw validationError if empty', async () => {
			const text = '';
			const business = await unsavedBusiness();
			business.terms = text;
			await expect(business.save()).rejects.toThrow('payment terms required');
		});

		it('terms to throw validationError if includes balcklisted characters', async () => {
			const text = '<>^';
			const business = await unsavedBusiness();
			business.terms = text;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in terms'
			);
		});

		it('terms to be downcased', async () => {
			const terms =
				"Thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!";
			const business = await unsavedBusiness();
			business.terms = terms;
			expect(business.terms).toBe(
				"thanks's very much for your business, we appreciate a prompt payment, cash is accecptable, 100% payment needed - wewew £0.00.!"
			);
		});

		it('farewell to throw validationError if empty', async () => {
			const text = '';
			const business = await unsavedBusiness();
			business.farewell = text;
			await expect(business.save()).rejects.toThrow('farewell required');
		});

		it('farewell to throw validationError if includes blacklisted characters', async () => {
			const text = '<>^';
			const business = await unsavedBusiness();
			business.farewell = text;
			await expect(business.save()).rejects.toThrow(
				'incorrect chatacter in farewell'
			);
		});

		it('farewell to be downcased', async () => {
			const farewell = 'yours SiNCeRely';
			const business = await unsavedBusiness();
			business.farewell = farewell;
			expect(business.farewell).toBe('yours sincerely');
		});
	});
});
