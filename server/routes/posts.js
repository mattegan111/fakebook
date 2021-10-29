const express = require('express');
const auth = require('../middleware/auth');
const errorCatcher = require('../middleware/errorCatcher');
const {
	body,
	validationResult,
} = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET api/posts
// @desc    Get all users posts
// @access  Private
router.get(
	'/',
	auth,
	errorCatcher(async (req, res) => {
		const posts = await Post.find({
			authorId: req.user.id,
		}).sort({
			date: 'desc',
		});

		if (!posts) {
			return res
				.status(404)
				.json({ msg: 'No posts found' });
		}

		res.json(posts);
	})
);

// @route   POST api/posts
// @desc    Add new post
// @access  Private
router.post(
	'/',
	[
		auth,
		[body('bodytext', 'Text is required').not().isEmpty()],
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext } = req.body;

		const post = new Post({
			bodytext,
			authorId: req.user.id,
		});

		await post.save();
		res.json(post);
	})
);

// @route   PUT api/posts/:id
// @desc    Update post
// @access  Private
router.put(
	'/:id',
	[
		auth,
		[body('bodytext', 'Text is required').not().isEmpty()],
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { bodytext } = req.body;

		let post = await Post.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ msg: 'Post not found' });
		}

		if (post.authorId.toString() !== req.user.id) {
			return res.status(403).json({ msg: 'Forbidden' });
		}

		post = await Post.findByIdAndUpdate(
			req.params.id,
			{ bodytext },
			{ new: true }
		);

		res.json(post);
	})
);

// @route   POST api/posts/:id/likes
// @desc    Add like to post
// @access  Private
router.post(
	'/:id/likes',
	auth,
	errorCatcher(async (req, res) => {
		let post = await Post.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ msg: 'Post not found' });
		}

		if (post.likes.includes(ObjectId(req.user.id))) {
			res.json({ msg: 'You already like this post' });
		}

		post = await Post.findByIdAndUpdate(
			req.params.id,
			{ $push: { likes: req.user.id } },
			{ new: true }
		);

		res.json(post);
	})
);

// @route 	DELETE api/posts/:id/likes
// @desc		Remove like from post
// @access	Private
router.delete(
	'/:id/likes',
	auth,
	errorCatcher(async (req, res) => {
		let post = await Post.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ msg: 'Post not found' });
		}

		if (!post.likes.includes(ObjectId(req.user.id))) {
			//TODO check if the ObjectId is necessary

			return res.json({
				msg: 'You already removed your like from this post',
			});
		}

		post = await Post.findByIdAndUpdate(
			req.params.id,
			{ $pull: { likes: req.user.id } },
			{ new: true }
		);

		res.json(post);
	})
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
	'/:id',
	auth,
	errorCatcher(async (req, res) => {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ msg: 'Post not found' });
		}

		if (post.authorId.toString() !== req.user.id) {
			return res.status(403).json({ msg: 'Forbidden' });
		}

		await Post.findByIdAndDelete(req.params.id);
		res.json({ msg: 'Post deleted' });
	})
);

module.exports = router;
