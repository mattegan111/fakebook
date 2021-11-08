const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
	notificationtype: {
		type: String,
		required: true,
	},

	notificationcontext: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref:'User',
	},

	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref:'User',
	},

	read: {
		type: Boolean,
		required: true,
	},
});

module.exports = mongoose.model(
	'notification',
	NotificationSchema
);
