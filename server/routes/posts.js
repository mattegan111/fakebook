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
			author: req.user.id,
		}).sort({
			date: -1,
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
			author: req.user.id,
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
		[
			// If 'bodytext' is provided, it should not be empty
			body('bodytext', 'Text is required')
				.optional()
				.not()
				.isEmpty(),
			// If 'like' is provided, it should not be empty
			body(
				'like',
				'A User Id is required to like this post'
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

		let post = await Post.findById(req.params.id);

		if (!post) {
			return res
				.status(404)
				.json({ msg: 'Post not found' });
		}

		if (like !== undefined) {
			if (post.likes.includes(like)) {
				res.json({ msg: 'You already like this post' });
			}

			if (!ObjectId.isValid(like)) {
				res.json({
					msg: 'User Id is not valid',
				});
			}

			post = await Post.findByIdAndUpdate(
				req.params.id,
				{ $push: { likes: like } },
				{ new: true }
			);

			res.json(post);
		} else if (bodytext !== undefined) {
			if (post.author.toString() !== req.user.id) {
				return res
					.status(401)
					.json({ msg: 'Not authorized' });
			}

			post = await Post.findByIdAndUpdate(
				req.params.id,
				{ bodytext },
				{ new: true }
			);

			res.json(post);
		} else {
			res.json({ msg: 'Post update failed' });
		}
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

		if (post.author.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Not authorized' });
		}

		await Post.findByIdAndDelete(req.params.id);
		res.json({ msg: 'Post deleted' });
	})
);

module.exports = router;
