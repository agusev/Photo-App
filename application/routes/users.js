const express = require('express');
const router = express.Router();
const { errorPrint, successPrint } = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');
const {
	registrationValidation,
	loginValidation,
} = require('../middleware/validation');
const UserModel = require('../models/Users');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.use('/register', registrationValidation);
router.post('/register', (req, res, next) => {
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;

	UserModel.usernameExists(username)
		.then((usernameDoesExist) => {
			if (usernameDoesExist) {
				throw new UserError(
					'Registration Failed: Username already exists',
					'/registration',
					200
				);
			} else {
				return UserModel.emailExists(email);
			}
		})
		.then((emailDoesExist) => {
			if (emailDoesExist) {
				throw new UserError(
					'Registration Failed: Email already exists',
					'/registration',
					200
				);
			} else {
				return UserModel.create(username, email, password);
			}
		})
		.then((createdUserId) => {
			if (createdUserId < 0) {
				throw new UserError(
					'Server Error: User cannot be created',
					'/registration',
					500
				);
			} else {
				successPrint('User.js --> user was created!!!');
				req.flash('success', 'user account was created!');
				res.redirect('/login');
			}
		})
		.catch((err) => {
			errorPrint('User cannot be created', err);
			if (err instanceof UserError) {
				errorPrint(err.getMessage());
				req.flash('error', err.getMessage());
				res.status(err.getStatus());
				res.redirect(err.getRedirectURL());
			} else {
				next(err);
			}
		});
});

router.use('/login', loginValidation);
router.post('/login', (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	UserModel.authenticate(username, password)
		.then((loggedUserId) => {
			if (loggedUserId > 0) {
				successPrint(`User ${username} is logged in`);
				req.session.username = username;
				req.session.userId = loggedUserId;
				req.flash('success', 'you have been successfully logged in!');
				res.locals.logged = true;
				res.locals.loading = false;
				res.redirect('/');
			} else {
				throw new UserError(
					'Invalid username or/and password',
					'/login',
					200
				);
			}
		})
		.catch((err) => {
			errorPrint('user login failed');
			if (err instanceof UserError) {
				errorPrint(err.getMessage());
				req.flash('error', err.getMessage());
				res.status(err.getStatus());
				res.redirect('/login');
			} else {
				next(err);
			}
		});
});

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			errorPrint("session couldn't be destroyed");
			next(err);
		} else {
			successPrint('session was destroyed');
			res.clearCookie('csid');
			res.locals.logged = false;
		}

		res.redirect('/login');
	});
});

module.exports = router;
