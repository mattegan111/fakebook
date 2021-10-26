const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
	bodytext: {
		type: String,
		required: true,
	},

	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],

	datecreated: {
		type: Date,
		default: Date.now(),
		required: true,
	},
});

module.exports = mongoose.model('comment', CommentSchema);
