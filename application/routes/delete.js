const express = require('express');
const router = express.Router();

const {
	deleteFiles,
	deletePostById,
	deleteCommentsByPostId,
} = require('../middleware/postsmiddleware');
const userCanDelete = require('../middleware/routeProtectors').userCanDelete;

/* DELETE post and comments by id. */
router.use('/post/:id', userCanDelete);
router.get(
	'/post/:id',
	deleteFiles,
	deleteCommentsByPostId,
	deletePostById,
	function (req, res, next) {
		console.log('Post was deleted');
	}
);

module.exports = router;
