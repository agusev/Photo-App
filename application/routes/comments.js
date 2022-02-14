const express = require('express');
const { now } = require('moment');
const router = express.Router();
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const { create } = require('../models/Comments');
const moment = require('moment');

router.post('/create', (req, res, next) => {
	if (!req.session.username) {
		errorPrint('Must be logged in to comment...');
		res.json({
			code: -1,
			status: 'danger',
			message: 'Must be logged in to comment...',
		});
	} else {
		let username = req.session.username;
		let userId = req.session.userId;
		let { postId, comment } = req.body;

		create(userId, postId, comment)
			.then((insertId) => {
				if (insertId != -1) {
					successPrint(`comment was created for ${username}`);
					res.json({
						code: 1,
						status: 'success',
						message: 'comment created',
						comment: comment,
						username: username,
						commentId: insertId,
						created: moment(new Date()).format('LLL'),
					});
				} else {
					errorPrint('comment was not saved');
					res.json({
						code: -1,
						status: 'danger',
						message: 'comment was not created',
					});
				}
			})
			.catch((err) => next(err));
	}
});

module.exports = router;
