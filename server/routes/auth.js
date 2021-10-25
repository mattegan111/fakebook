const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const errorCatcher = require('../middleware/errorCatcher');
const {
	body,
	validationResult,
} = require('express-validator');
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get(
	'/',
	auth,
	errorCatcher(async (req, res) => {
		const user = await User.findById(req.user.id).select(
			'-password'
		);
		if (!user) {
			return res
				.status(400)
				.json({ msg: 'User Does Not Exist' });
		}
		res.json(user);
	})
);

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public
router.post(
	'/',
	[
		body('email', 'Please include a valid email').isEmail(),
		body('password', 'Password is required').exists(),
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ msg: 'Invalid Credentials' });
		}

		const isMatch = await bcrypt.compare(
			password,
			user.password
		);

		if (!isMatch) {
			return res
				.status(400)
				.json({ msg: 'Invalid Credentials' });
		}

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(
			payload,
			config.get('jwtSecret'),
			{
				expiresIn: config.get('expiresIn'),
			},
			(err, token) => {
				if (err) throw err;
				res.json({ token });
			}
		);
	})
);

module.exports = router;
