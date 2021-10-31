const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
	bodytext: {
		type: String,
		required: true,
	},

	authorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
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

module.exports = mongoose.model('post', PostSchema);
