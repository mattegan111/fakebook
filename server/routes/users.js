const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { firstname, lastname, email, password } =
			req.body;

		try {
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

			res.send('user saved');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);

module.exports = router;
