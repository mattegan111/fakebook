const express = require('express');
const auth = require('../middleware/auth');
const errorCatcher = require('../middleware/errorCatcher');
const router = express.Router();

const Notification = require('../models/Notification');

// @route   GET api/notifications
// @desc    Get all users notifications
// @access  Private
router.get(
	'/',
	auth,
	errorCatcher(async (req, res) => {
		const notifications = await Notification.find({
			receiver: req.user.id,
		}).sort({
			date: -1,
		});

		if (!notifications) {
			return res
				.status(404)
				.json({ msg: 'No Notifications found' });
		}

		res.json(notifications);
	})
);

// @route   POST api/notifications
// @desc    Add new notification
// @access  Private
router.post(
	'/',
	auth,
	errorCatcher(async (req, res) => {
		const {
			notificationtype,
			notificationcontext,
			recipient,
		} = req.body;

		const notification = new Notification({
			notificationtype,
			notificationcontext,
			sender: req.user.id,
			recipient,
			read: false,
		});

		await notification.save();
		res.json(notification);
	})
);

// @route   PUT api/notifications/:id
// @desc    Update notification
// @access  Private
router.put(
	'/:id',
	auth,
	errorCatcher(async (req, res) => {
		const read = req.body.read;

		let notification = await Notification.findById(
			req.params.id
		);

		if (!notification) {
			return res
				.status(404)
				.json({ msg: 'Notification not found' });
		}

		if (notification.recipient.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Not authorized' });
		}

		notification = await Notification.findByIdAndUpdate(
			req.params.id,
			{ read },
			{ new: true }
		);

		res.json(notification);
	})
);

// @route   DELETE api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete(
	'/:id',
	auth,
	errorCatcher(async (req, res) => {
		const notification = await Notification.findById(
			req.params.id
		);

		if (!notification) {
			return res
				.status(404)
				.json({ msg: 'Notification not found' });
		}

		if (notification.recipient.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ msg: 'Not authorized' });
		}

		await Notification.findByIdAndDelete(req.params.id);
		res.json({ msg: 'Notification deleted' });
	})
);

module.exports = router;
