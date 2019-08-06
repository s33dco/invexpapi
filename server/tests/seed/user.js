const faker = require('faker/locale/en');
const { User } = require('../../models/user');

const savedUser = () => {
	return new User({
		email: faker.internet.email(),
		password: 'passwordpassword'
	}).save();
};

const unsavedUser = () => {
	return new User({
		email: faker.internet.email(),
		password: 'passwordpassword'
	});
};

module.exports = { savedUser, unsavedUser };
