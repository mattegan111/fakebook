const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
	bodytext: {
		type: String,
		required: true,
	},

	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post',
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
