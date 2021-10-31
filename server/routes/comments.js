const express = require('express');
const auth = require('../middleware/auth');
const errorCatcher = require('../middleware/errorCatcher');
const {
	body,
	validationResult,
} = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

const Comment = require('../models/Comment');

// @route   GET api/comments
// @desc    Get all users comments
// @access  Private
router.get(
	'/',
	auth,
	errorCatcher(async (req, res) => {
		const comments = await Comment.find({
			authorId: req.user.id,
		}).sort({
			date: -1,
		});

		if (!comments) {
			return res
				.status(404)
				.json({ msg: 'No comments found' });
		}

		res.json(comments);
	})
);

// @route   POST api/comments
// @desc    Add new comment
// @access  Private
router.post(
	'/',
	[
		auth,
		[body('bodytext', 'Text is required').not().isEmpty()],
		[body('post', 'Post is required').not().isEmpty()],
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext, post } = req.body;

		const comment = new Comment({
			bodytext,
			post,
			authorId: req.user.id,
		});

		await comment.save();
		res.json(comment);
	})
);

// @route   PUT api/comments/:id
// @desc    Update comment
// @access  Private
router.put(
	'/:id',
	[
		auth,
		[
			// If 'bodytext' is provided, it should not be empty
			body('bodytext', 'Text is required')
				.optional()
				.not()
				.isEmpty(),
			// If 'like' is provided, it should not be empty
			body(
				'like',
				'A User Id is required to like this comment'
			)
				.optional()
				.not()
				.isEmpty(),
		],
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext, like } = req.body;

		let comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res
				.status(404)
				.json({ msg: 'Comment not found' });
		}

		if (like !== undefined) {
			if (comment.likes.includes(like)) {
				res.json({ msg: 'You already like this comment' });
			}

			if (!ObjectId.isValid(like)) {
				res.json({
					msg: 'User Id is not valid',
				});
			}

			comment = await Comment.findByIdAndUpdate(
				req.params.id,
				{ $push: { likes: like } },
				{ new: true }
			);

			res.json(comment);
		} else if (bodytext !== undefined) {
			if (comment.authorId.toString() !== req.user.id) {
				return res
					.status(401)
					.json({ msg: 'Not authorized' });
			}

			comment = await Comment.findByIdAndUpdate(
				req.params.id,
				{ bodytext },
				{ new: true }
			);

			res.json(comment);
		} else {
			res.json({ msg: 'Comment update failed' });
		}
	})
);

// @route   DELETE api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete(
	'/:id',
	auth,
	errorCatcher(async (req, res) => {
		const comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res
				.status(404)
				.json({ msg: 'Comment not found' });
		}

		if (comment.authorId.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Not authorized' });
		}

		await Comment.findByIdAndDelete(req.params.id);
		res.json({ msg: 'Comment deleted' });
	})
);

module.exports = router;
