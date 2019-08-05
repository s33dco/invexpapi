const config = require('config');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 6,
		trim: true
	},
	password: {
		type: String,
		require: true,
		minlength: 10
	}
});

userSchema.statics.findByEmail = function(email) {
	return this.findOne({ email: email });
};

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin, name: this.firstName },
		config.get('JWT_SECRET'),
		{ expiresIn: '1h' }
	);
	return token;
};

userSchema.pre('save', async function(next) {
	const user = this;

	if (user.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
	}
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
