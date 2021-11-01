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
	auth,
	[body('bodytext', 'Text is required').not().isEmpty()],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext, post } = req.body;

		if (!post) {
			return res
				.status(400)
				.json({ msg: 'Post is required' });
		}

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
	//TODO consider using 'patch'
	'/:id',
	[
		auth,
		body('bodytext', 'Text is required').not().isEmpty(),
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext } = req.body;

		let comment = await Comment.findById(req.params.id);

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

		comment = await Comment.findByIdAndUpdate(
			req.params.id,
			{ bodytext },
			{ new: true }
		);

		res.json(comment);
	})
);

// @route   POST api/comments/:id/likes
// @desc    Add like to comment
// @access  Private
router.post(
	'/:id/likes',
	auth,
	errorCatcher(async (req, res) => {
		let comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res
				.status(404)
				.json({ msg: 'Comment not found' });
		}

		if (comment.likes.includes(ObjectId(req.user.id))) {
			res.json({ msg: 'You already like this comment' });
		}

		comment = await Comment.findByIdAndUpdate(
			req.params.id,
			{ $push: { likes: req.user.id } },
			{ new: true }
		);

		res.json(comment);
	})
);

// @route 	DELETE api/comments/:id/likes
// @desc		Remove like from comment
// @access	Private
router.delete(
	'/:id/likes',
	auth,
	errorCatcher(async (req, res) => {
		let comment = await Comment.findById(req.params.id);

		if (!comment) {
			return res
				.status(404)
				.json({ msg: 'Comment not found' });
		}

		if (!comment.likes.includes(ObjectId(req.user.id))) {
			return res.json({
				msg: 'You already removed your like from this comment',
			});
		}

		comment = await Comment.findByIdAndUpdate(
			req.params.id,
			{ $pull: { likes: req.user.id } },
			{ new: true }
		);

		res.json(comment);
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
