const faker = require('faker/locale/en');
const mongoose = require('mongoose');
const { Client } = require('../../models/client');

const savedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		name: faker.company.companyName(),
		phone: '0121 456 7894',
		email: faker.internet.email(),
		add1: faker.address.streetAddress(),
		add2: faker.address.county(),
		postcode: 'bn3 8gh'
	}).save();
};

const unsavedClient = () => {
	return new Client({
		userId: mongoose.Types.ObjectId(),
		name: faker.company.companyName(),
		phone: '07777 765432',
		email: faker.internet.email(),
		add1: faker.address.streetAddress(),
		add2: faker.address.county(),
		postcode: 'wc1a 7hg'
	});
};

module.exports = { savedClient, unsavedClient };
