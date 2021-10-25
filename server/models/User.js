const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	bio: {
		type: String,
	},
	friends: {
		type: Array,
	},
	notifications: {
		type: Array,
	},
	receivedfriendrequests: {
		type: Array,
	},
	sentfriendrequests: {
		type: Array,
	},
	post: {
		type: Array,
	},
	comments: {
		type: Array,
	},
});

UserSchema.virtual('fullname').get(() => {
	return this.firstname + ' ' + this.lastname;
});

module.exports = mongoose.model('user', UserSchema);
