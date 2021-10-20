const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const errorCatcher = require('../middleware/errorCatcher');
const {
	body,
	validationResult,
} = require('express-validator');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
	'/',
	[
		body('firstname', 'Please include your first name')
			.not()
			.isEmpty(),
		body('lastname', 'Please include your last name')
			.not()
			.isEmpty(),
		body('email', 'Please include a valid email'),
		body(
			'password',
			'Please include a password with 6 or more characters'
		).isLength({ min: 6 }),
	],
	errorCatcher(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { firstname, lastname, email, password } =
			req.body;

		let user = await User.findOne({ email: email });

		if (user) {
			return res
				.status(400)
				.json({ msg: 'Email already in use' });
		}

		user = new User({
			firstname,
			lastname,
			email,
			password,
		});

		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await user.save();

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
