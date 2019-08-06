const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = { User };
