const checkUsername = (username) => {
	/**
	 * RegEx explanation
	 * ^			--> Start of the string
	 * [A-Za-z]		--> Matches first charachter in the range between (a and z) and (A and Z)
	 * [A-Za-z0-9]	--> Matches any charachter in the range between (a and z) and (A and Z) and (0 and 9)
	 * {7,}			--> matches the previous token between 7 and unlimited times
	 * $			--> end of the string
	 */
	let onlyAlphaNumWithFirstLetterMin8 = /^[A-Za-z][A-Za-z0-9]{7,}$/;

	return onlyAlphaNumWithFirstLetterMin8.test(username);
};

const checkEmail = (email) => {
	/**
	 * RegEx explanation
	 * ^			--> Start of the string
	 * [-.\w]		--> Matches a single character: . or - or _ or digit or any word character (equivalent to [a-zA-Z0-9_])
	 * {3,}			--> matches the previous token between 3 and unlimited times
	 * \.			--> matches the character .
	 * \@ 			--> matches the character @
	 * + 			--> matches the previous token between one and unlimited times
	 * $			--> end of the string
	 */
	let isEmail = /^[-.\w]{3,}\@[-.\w]{3,}\.[-.\w]+$/;

	return isEmail.test(email);
};

const checkPassword = (password) => {
	/**
	 * RegEx explanation
	 * ^			--> Start of the string
	 * ?=			--> Positive Lookahead
	 * . 			--> matches any character (
	 * *			--> matches the previous token between zero and unlimited times
	 * ()			--> Capturing Group - matches any position
	 * {8,}			--> matches the previous token between 8 and unlimited times
	 * [a-z]		--> matches a single character in the range between a and z (case sensitive)
	 * [A-Z]		--> matches a single character in the range between A and Z (case sensitive)
	 * [0-9]		--> matches a single character in the range between 0 and 9 (case sensitive)
	 * [_!@#$%^&*]	--> matches a single character present in the list [_!@#$%^&*]
	 * \w			--> matches a single character present in the list [a-zA-Z0-9_]
	 * $			--> end of the string
	 */
	let isPassword =
		/(?=.*[0-9])(?=.*[_!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[!@#$%^&*\w]{8,}/;

	return isPassword.test(password);
};

const checkPassword2 = (password, password2) => {
	return password === password2;
};

const checkAge = (age) => {
	return age >= 13;
};

const checkAgreement = (agreement) => {
	return agreement;
};

const registrationValidation = (req, res, next) => {
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let password2 = req.body.password2;
	let age = req.body.age;
	let agreement = req.body.agreement;

	if (!checkUsername(username)) {
		req.flash('error', 'invalid username');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else if (!checkEmail(email)) {
		req.flash('error', 'invalid email');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else if (!checkPassword(password)) {
		req.flash('error', 'invalid password');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else if (!checkPassword2(password, password2)) {
		req.flash('error', 'passwords should match');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else if (!checkAge(age)) {
		req.flash('error', 'must be older than 13 years old');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else if (!checkAgreement(agreement)) {
		req.flash('error', 'must agree to the terms');
		req.session.save((err) => {
			res.redirect('/registration');
		});
	} else {
		next();
	}
};

const loginValidation = (req, res, next) => {
	let username = req.body.username;
	let password = req.body.password;

	if (username && username.length < 8) {
		req.flash('error', 'Invalid username');
		req.session.save((err) => {
			res.redirect('/login');
		});
	} else if (password && password.length < 8) {
		req.flash('error', 'Invalid password');
		req.session.save((err) => {
			res.redirect('/login');
		});
	} else {
		next();
	}
};

module.exports = { registrationValidation, loginValidation };
