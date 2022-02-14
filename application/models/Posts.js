const db = require('../config/database');
const moment = require('moment');

const PostModel = {};

PostModel.create = (title, description, photopath, thumbnail, fk_userId) => {
	let baseSQL =
		'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userId) VALUES (?,?,?,?,now(),?);';

	return db
		.execute(baseSQL, [title, description, photopath, thumbnail, fk_userId])
		.then(([results, fields]) => {
			return Promise.resolve(results && results.affectedRows);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
	let baseSQL = `SELECT id, title, description, thumbnail, fk_userId, concat_ws(' ', title, description)
		AS haystack
		FROM posts
		HAVING haystack like ?`;

	let sqlReadySearchTerm = `%${searchTerm}%`;

	return db
		.execute(baseSQL, [sqlReadySearchTerm])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.getMostRecentPosts = (numberOfPosts) => {
	let baseSQL = `SELECT id, title, description, photopath, thumbnail, created, fk_userId FROM posts ORDER BY created DESC LIMIT ?`;

	return db
		.execute(baseSQL, [numberOfPosts])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.deletePostById = (postId) => {
	let baseSQL = `
					DELETE FROM posts p
					WHERE p.id=?
					`;

	return db
		.execute(baseSQL, [postId])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.deleteCommentsByPostId = (postId) => {
	let baseSQL = `
					DELETE FROM comments
					WHERE fk_postId=?; 
				`;

	return db
		.execute(baseSQL, [postId])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.deleteFiles = (postId) => {
	let baseSQL = `
					SELECT photopath, thumbnail 
					FROM posts
					WHERE id=?;
				`;

	return db
		.execute(baseSQL, [postId])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.getUserPosts = (userId) => {
	let baseSQL = `SELECT u.username, p.id, p.title, p.description, p.thumbnail, p.photopath, p.created, p.fk_userId
	FROM users u
	JOIN posts p
	ON u.id=fk_userId
	WHERE p.fk_userId=?
	ORDER BY created DESC`;
	return db
		.execute(baseSQL, [userId])
		.then(([results, fields]) => {
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
	let baseSQL = `SELECT u.username, p.title, p.description, p.photopath, p.created
			FROM users u
			JOIN posts p
			ON u.id=fk_userId
			WHERE p.id= ?;`;

	return db
		.execute(baseSQL, [`${postId}`])
		.then(([results, fields]) => {
			results[0].created = moment(results[0].created).format('LLL');
			return Promise.resolve(results);
		})
		.catch((err) => Promise.reject(err));
};

module.exports = PostModel;
