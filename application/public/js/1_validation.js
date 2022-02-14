let form = document.getElementById('registration');

let validationFlag = false;

let validationArr = {
	usernameFlag: {
		firstLetter: false,
		minLength: false,
		isAlphaNumeric: false,
	},
	emailFlag: {
		isEmail: false,
	},
	passwordFlag: {
		minLength: false,
		lowerCase: false,
		upperCase: false,
		number: false,
		specialCh: false,
	},
	password2Flag: {
		passwordsMatch: false,
	},
	ageFlag: {
		olderThan13: false,
	},
	agreementFlag: {
		agreed: false,
	},
};

const inputNames = [
	'name=username',
	'name=email',
	'name=password',
	'name=password2',
	'name=age',
	'name=agreement',
];

let iterateThroughArr = (arr) => {
	validationFlag = true;

	for (let el in arr) {
		let data = arr[el];
		for (let element in data) {
			if (data[element] === false) {
				validationFlag = false;
				break;
			}
		}
	}
};

let inputStatus = () => {
	iterateThroughArr(validationArr);

	// let el = document.getElementById('submitBtn');

	// if (!validationFlag) {
	// 	el.disabled = true;
	// } else {
	// 	el.disabled = false;
	// }
};

/**
 * ---------------------------------------------------------
 * username validation
 * @param {*} username
 */

let validateUsername = (username) => {
	inputStatus();

	validateUsernameFirstLetter(username);
	validateUsernameMinLength(username);
	validateOnlyAlphaNumeric(username);
};

let validateUsernameFirstLetter = (username) => {
	let el = document.getElementById('username-hint-1');

	if (
		(username && !username[0].match(/[a-zA-Z]/i)) ||
		username.length === 0
	) {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.usernameFlag.firstLetter = false;
	} else {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.usernameFlag.firstLetter = true;
	}
};

let validateUsernameMinLength = (username) => {
	let el = document.getElementById('username-hint-2');

	if (username && username.length >= 8) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.usernameFlag.minLength = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.usernameFlag.minLength = false;
	}
};

let validateOnlyAlphaNumeric = (username) => {
	let el = document.getElementById('username-hint-3');
	let flag = true;
	let regExp = new RegExp('^[a-zA-Z0-9_]*$');

	for (ch in username) {
		if (!username.charAt(ch).match(regExp)) {
			flag = false;
		}
	}

	if (username && flag) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.usernameFlag.isAlphaNumeric = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.usernameFlag.isAlphaNumeric = false;
	}
};

/**
 * end username validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * email validation
 * @param {*} email
 */

let validateEmail = (email) => {
	inputStatus();

	validateIsEmail(email);
};

let validateIsEmail = (email) => {
	let el = document.getElementById('email-hint-1');
	let isEmail = /^[-.\w]{3,}\@[-.\w]{3,}\.[-.\w]+$/;

	if (isEmail.test(email)) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.emailFlag.isEmail = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.emailFlag.isEmail = false;
	}
};

/**
 * end email validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * password validation
 * @param {*} password
 */

let validatePassword = (password) => {
	inputStatus();

	passwordMinLength(password);
	passwordContainsLowercase(password);
	passwordContainsUppercase(password);
	passwordContainsNumber(password);
	passwordContainsSpecialCh(password);
};

let passwordMinLength = (password) => {
	let el = document.getElementById('password-hint-1');

	if (password.length >= 8) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.passwordFlag.minLength = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.passwordFlag.minLength = false;
	}
};

let passwordContainsLowercase = (password) => {
	let el = document.getElementById('password-hint-2');

	let containsLowerCase = /(?=.*[a-z])/;

	if (containsLowerCase.test(password)) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.passwordFlag.lowerCase = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.passwordFlag.lowerCase = false;
	}
};

let passwordContainsUppercase = (password) => {
	let el = document.getElementById('password-hint-3');

	let containsUpperCase = /(?=.*[A-Z])/;

	if (containsUpperCase.test(password)) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.passwordFlag.upperCase = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.passwordFlag.upperCase = false;
	}
};

let passwordContainsNumber = (password) => {
	let el = document.getElementById('password-hint-4');

	let containsNumber = /(?=.*[0-9])/;

	if (containsNumber.test(password)) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.passwordFlag.number = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.passwordFlag.number = false;
	}
};

let passwordContainsSpecialCh = (password) => {
	let el = document.getElementById('password-hint-5');

	let containsSpecialCh = /(?=.*[_!@#$%^&*])/;

	if (containsSpecialCh.test(password)) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.passwordFlag.specialCh = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.passwordFlag.specialCh = false;
	}
};

/**
 * end password validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * password validation
 * @param {*} password2
 */

let validatePassword2 = (password2) => {
	inputStatus();

	passwordsMatch(password2);
};

let passwordsMatch = (password2) => {
	let password = document.querySelector('#password input.form-control').value;
	let el = document.getElementById('password2-hint-1');

	if (password === password2) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.password2Flag.passwordsMatch = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.password2Flag.passwordsMatch = false;
	}
};

/**
 * end password validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * age validation
 * @param {*} age
 */

let validateAge = (age) => {
	inputStatus();

	checkAge(age);
};

let checkAge = (age) => {
	let el = document.getElementById('age-hint-1');

	if (age >= 13) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.ageFlag.olderThan13 = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.ageFlag.olderThan13 = false;
	}
};

/**
 * end age validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * age validation
 * @param {*} agreement
 */

let validateAgreement = (agreement) => {
	inputStatus();

	checkAgreement(agreement);
};

let checkAgreement = (agreement) => {
	let el = document.getElementById('agreement-hint-1');

	if (agreement.checked) {
		el.classList.remove('alert-secondary');
		el.classList.add('alert-success');
		validationArr.agreementFlag.agreed = true;
	} else {
		el.classList.remove('alert-success');
		el.classList.add('alert-secondary');
		validationArr.agreementFlag.agreed = false;
	}
};

/**
 * end age validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * form validation
 *
 */

const validateForm = () => {
	let username = form.querySelector('input[name="username"]').value;

	validateUsername(username);
	iterateThroughArr(validationArr);
	if (validationFlag) {
		form.submit();
	}
};

/**
 * end form validation
 * ---------------------------------------------------------
 */

/**
 * ---------------------------------------------------------
 * delete post
 *
 */

function confirmDelete(e) {
	e.preventDefault();

	let del = confirm('Delete post???');

	if (del) {
		return (location.href = `${e.target.href}`);
	}
	return false;
}

/**
 * end delete post
 * ---------------------------------------------------------
 */
