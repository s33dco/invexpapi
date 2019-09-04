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

		it('bName to throw validationError if empty string', async () => {
			const business = await unsavedBusiness();
			business.bName = '';
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bName to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const name = new Array(27).join('longName55');
			business.bName = name;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bName saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const name = 'LoWeRCaSE';
			business.bName = name;
			await business.save();
			expect(business.bName).toBe('lowercase');
		});

		it('bName to throw validationError if includes non word characters', async () => {
			const names = ['<>', '|{}', '$_+=', '@!@', '-->'];
			let business;
			names.forEach(async name => {
				business = await unsavedBusiness();
				business.bName = name;
				await expect(business.save()).rejects.toThrow(
					'Business validation failed'
				);
			});
		});

		it('bContact must be present', async () => {
			const name = '';
			const business = await unsavedBusiness();
			business.bContact = name;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bContact to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const name = new Array(27).join('longName55');
			business.bContact = name;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bContact is saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const name = 'MR UPPERCASE';
			business.bContact = name;
			await business.save();
			expect(business.bContact).toBe('mr uppercase');
		});

		it('bContact to throw validationError if includes non word characters', async () => {
			const names = ['<>', '|{}', '$_+=', '@!@', '-->', '?%^&£'];
			let business;
			names.forEach(async name => {
				business = await unsavedBusiness();
				business.bContact = name;
				await expect(business.save()).rejects.toThrow(
					'Business validation failed'
				);
			});
		});

		it('bContact accepts hypenated punctuated names', async () => {
			let businesses = await Business.find().countDocuments();
			expect(businesses).toBe(1);
			const name = "Mr. John O'Flaherty-Mincepie Esq. ";
			const business = await unsavedBusiness();
			business.bContact = name;
			await business.save();
			businesses = await Business.find().countDocuments();
			expect(businesses).toBe(2);
		});

		it('bEmail to throw validationError if empty', async () => {
			const email = '';
			const business = await unsavedBusiness();
			business.bEmail = email;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bEmail to throw validationError if invalid email address.', async () => {
			const emails = ['@bmail', 'del@del', 'del[at]del[dot]com', 'del@delcom'];
			let business;
			emails.forEach(async email => {
				business = await unsavedBusiness();
				business.bEmail = email;
				await expect(business.save()).rejects.toThrow(
					'Business validation failed'
				);
			});
		});

		it('bEmail to throw validationError if > 255 characters', async () => {
			const business = await unsavedBusiness();
			const bEmail = new Array(30).join('email@email.com');
			business.bEmail = bEmail;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bEmail saved as lowercase', async () => {
			const business = await unsavedBusiness();
			const email = 'MYEMAILADDRESS@EMAILPROVIDER.COM';
			business.bEmail = email;
			await business.save();
			expect(business.bEmail).toBe('myemailaddress@emailprovider.com');
		});

		it('bPhone to throw validationError if empty', async () => {
			const phone = '';
			const business = await unsavedBusiness();
			business.bPhone = phone;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPhone to throw validationError if too short', async () => {
			const phone = '123 678';
			const business = await unsavedBusiness();
			business.bPhone = phone;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPhone to throw validationError if too long', async () => {
			const phone = '123 678 890 898098080';
			const business = await unsavedBusiness();
			business.bPhone = phone;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPhone to throw validationError if any non digits', async () => {
			const phone = '(01278) 788788';
			const business = await unsavedBusiness();
			business.bPhone = phone;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bAdd1 to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.bAdd1 = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bAdd1 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.bAdd1 = add1;
			await business.save();
			expect(business.bAdd1).toBe('13 top street');
		});

		it('bAdd1 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.bAdd1 = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bAdd2 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.bAdd2 = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bAdd2 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.bAdd2 = add1;
			await business.save();
			expect(business.bAdd2).toBe('13 top street');
		});

		it('bAdd3 to save in lowercase', async () => {
			const add1 = '13 TOP STREET';
			const business = await unsavedBusiness();
			business.bAdd3 = add1;
			await business.save();
			expect(business.bAdd3).toBe('13 top street');
		});

		it('bAdd3 to throw validationError if include non standard characters', async () => {
			const add1 = '<big>!ddd****';
			const business = await unsavedBusiness();
			business.bAdd3 = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPcode to throw validationError if empty', async () => {
			const pcode = '';
			const business = await unsavedBusiness();
			business.bPcode = pcode;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPcode to throw validationError if wrong format', async () => {
			const code = 'thwe1 229292';
			const business = await unsavedBusiness();
			business.bPcode = code;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bPcode saved as uppercase', async () => {
			const business = await unsavedBusiness();
			const code = 'wc1a 7yu';
			business.bPcode = code;
			await business.save();
			expect(business.bPcode).toBe('WC1A 7YU');
		});

		it('bankName to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.bankName = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('bankName to throw validationError if non standard characters', async () => {
			const add1 = 'The! CO%OP bank';
			const business = await unsavedBusiness();
			business.bankName = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
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
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('sortCode to throw validationError if non standard characters', async () => {
			const add1 = '23/23/23';
			const business = await unsavedBusiness();
			business.sortCode = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('accountNo to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.accountNo = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('accountNo to throw validationError if tpp many digits', async () => {
			const add1 = '129837192837';
			const business = await unsavedBusiness();
			business.accountNo = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('utr to throw validationError if empty', async () => {
			const add1 = '';
			const business = await unsavedBusiness();
			business.utr = add1;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('utr to throw validationError if too many digits', async () => {
			const utr = '987654321987654321';
			const business = await unsavedBusiness();
			business.utr = utr;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('terms to throw validationError if empty', async () => {
			const text = '';
			const business = await unsavedBusiness();
			business.terms = text;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
			);
		});

		it('terms to throw validationError if includes balcklisted characters', async () => {
			const text = '<>^';
			const business = await unsavedBusiness();
			business.terms = text;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
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

		it('farewell to throw validationError if includes blacklisted characters', async () => {
			const text = '<>^';
			const business = await unsavedBusiness();
			business.farewell = text;
			await expect(business.save()).rejects.toThrow(
				'Business validation failed'
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
