const db = require('../config/database');
const moment = require('moment');

const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
	let baseSQL = `INSERT INTO comments 
                    (comment, fk_postId, fk_authorId) 
                    VALUES (?, ?, ?);`;

	return db
		.query(baseSQL, [comment, postId, userId])
		.then(([results, fields]) => {
			if (results && results.affectedRows) {
				return Promise.resolve(results.insertId);
			} else {
				return Promise.resolve(-1);
			}
		})
		.catch((err) => Promise.reject(err));
};

CommentModel.getCommentsForThePost = (postId) => {
	let baseSQL = `SELECT u.username, c.comment, c.created, c.id
     FROM comments  c
     JOIN users u
     ON u.id = fk_authorId
     WHERE c.fk_postId=?
     ORDER BY c.created DESC`;

	return db
		.query(baseSQL, [`${postId}`])
		.then(([results, fields]) => {
			results.forEach((el) => {
				el.created = moment(results[0].created).format('LLL');
			});

			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

module.exports = CommentModel;
