const express = require('express');
const router = express.Router();
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
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		res.send('passed');
	}
);

module.exports = router;
