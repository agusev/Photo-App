const {
	getUserPosts,
	getMostRecentPosts,
	getPostById,
	deletePostById,
	deleteCommentsByPostId,
	deleteFiles,
} = require('../models/Posts');
const { getCommentsForThePost } = require('../models/Comments');
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const fs = require('fs');

const postMiddleware = {};

postMiddleware.getRecentPosts = async function (req, res, next) {
	try {
		let results = await getMostRecentPosts('8');
		let userId = req.session.userId;

		results.forEach((result) => {
			if (userId === result.fk_userId) result.deleteBtn = true;
		});
		res.locals.results = results;

		if (results.length == 0) {
			req.flash('error', 'There are no posts created yet');
		}
		next();
	} catch (err) {
		next(err);
	}
};

postMiddleware.getUserPosts = async function (req, res, next) {
	try {
		let userId = req.session.userId;

		let results = await getUserPosts(`${userId}`);
		results.forEach((result) => {
			if (userId === result.fk_userId) result.deleteBtn = true;
		});

		res.locals.results = results;
		if (results.length == 0) {
			req.flash('error', 'There are no posts created yet');
			res.redirect('/postImage');
		}
		next();
	} catch (err) {
		next(err);
	}
};

postMiddleware.getPostById = async function (req, res, next) {
	try {
		let postId = req.params.id;

		let results = await getPostById(postId);

		if (results && results.length) {
			res.locals.currentPost = results[0];
			next();
		} else {
			req.flash('error', 'This is not the post you are looking for');
			res.redirect('/');
		}
	} catch (err) {
		next(err);
	}
};

postMiddleware.deletePostById = async function (req, res, next) {
	try {
		let postId = req.params.id;

		let results = await deletePostById(postId);

		if (results.affectedRows == 1) {
			req.flash('success', ' Post was deleted');
			res.redirect('/');
			next();
		} else {
			req.flash('error', 'You cannot delete this post');
			res.redirect('/');
		}
	} catch (err) {
		req.flash('error', 'you cannot delete this post');
		next(err);
	}
};

postMiddleware.deleteCommentsByPostId = async function (req, res, next) {
	try {
		let postId = req.params.id;

		let result = await deleteCommentsByPostId(postId);

		if (result.affectedRows >= 1) {
			req.flash(
				'success',
				`${result.affectedRows} comments were deleted`
			);
		}
		next();
	} catch (err) {
		req.flash('error', 'you cannot delete comments');
		next(err);
	}
};

postMiddleware.deleteFiles = async function (req, res, next) {
	try {
		let postId = req.params.id;

		let results = await deleteFiles(postId);

		let photoPath = results[0].photopath;
		let thumbnailPath = results[0].thumbnail;

		fs.unlink(photoPath, (err) => {
			if (err) {
				errorPrint('Error deleting picture');
				return;
			} else {
				successPrint('Picture was deleted');
			}
		});

		fs.unlink(thumbnailPath, (err) => {
			if (err) {
				errorPrint('Error deleting thumbnail');
				return;
			} else {
				successPrint('Thumbnail was deleted');
			}
		});

		next();
	} catch (err) {
		req.flash('error', 'you cannot delete pics');
		next(err);
	}
};

postMiddleware.getCommentsById = async function (req, res, next) {
	let postId = req.params.id;

	try {
		let results = await getCommentsForThePost(postId);
		res.locals.currentPost.comments = results;
		next();
	} catch (err) {
		next(err);
	}
};

postMiddleware.uploadValidation = async function (req, res, next) {
	try {
		let title = req.body.title;
		let description = req.body.description;
		let agreement = req.body.agreement;

		if (description.length === 0) {
			req.body.description = 'No description';
		}

		if (title.length === 0) {
			req.body.title = 'No title';
		}

		if (title.length === 0) {
			req.body.title = 'No title';
		}

		if (!agreement) {
			req.flash('error', 'you need to agree!');
			res.redirect('/postImage');
		}

		next();
	} catch (err) {
		req.flash('error', 'you need to select a picture!');
		res.redirect('/postImage');
		next(err);
	}
};

module.exports = postMiddleware;
