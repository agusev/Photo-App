let flashElement = document.getElementById('flash-message');

// Spinner page
let spinner = () => {
	let el = document.getElementsByClassName('container')[0];
	let spinner = document.createElement('div');
	spinner.setAttribute('id', 'spinner');
	spinner.innerHTML = `<div class='spinner-grow text-secondary' 
								style='width: 10rem; height: 10rem;' 
								role='status'> 
								<span class='visually-hidden'>Loading...</span>
								</div>`;

	el.appendChild(spinner);
};

spinner();

window.onload = function () {
	setTimeout(() => {
		let el = document.getElementsByClassName('container')[0];
		let spinner = document.getElementById('spinner');

		if (spinner) {
			el.removeChild(spinner);
		}
	}, 100);
};

// End spinner page

// --------------------- Search ---------------------------------

function createCard(postData) {
	if (postData.deleteBtn) {
		return `<div id='post-${postData.id}' class='card bg-light'>
		<div class='card-image-wrapper'>
					<img class='card-image' src='/${postData.thumbnail}' alt='no image' />
					</div>
					<div class='card-body'>
						<h5 class='card-title'>${postData.title}</h5>
						<p class='card-text'>${postData.description}</p>
						<div class='btn-group' role='group'>
							<a href='/post/${postData.id}' class='btn btn-secondary'>Post Details</a>
							<a href='/post/delete/${postData.id}' 
							onclick='confirmDelete(event)'
							class='delete-btn btn btn-danger'>Delete Post</a>
						</div>
					</div>
				</div>`;
	} else {
		return `<div id='post-${postData.id}' class='card bg-light'>
		<div class='card-image-wrapper'>
					<img class='card-image' src='/${postData.thumbnail}' alt='no image' />
					</div>
					<div class='card-body'>
						<h5 class='card-title'>${postData.title}</h5>
						<p class='card-text'>${postData.description}</p>
						<a href='/post/${postData.id}' class='btn btn-secondary'>Post Details</a>

					</div>
				</div>`;
	}
}

function executeSearch() {
	let searchTerm = document.getElementById('search-text').value;

	if (!searchTerm) {
		location.replace('/');
		return;
	}
	let mainContent = document.getElementById('main-content');
	let searchURL = `/posts/search?search=${searchTerm}`;

	fetch(searchURL)
		.then((data) => {
			return data.json();
		})
		.then((data_json) => {
			let newMainNewContentHTML = '';
			data_json.results.forEach((row) => {
				newMainNewContentHTML += createCard(row);
			});
			mainContent.innerHTML = newMainNewContentHTML;
			if (data_json.message) {
				addFlashFromFrontend(data_json.message);
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

function addFlashFromFrontend(message) {
	let flashMessageDiv = document.createElement('div');
	let innerFlashDiv = document.createElement('div');
	let innerTextNode = document.createTextNode(message);
	innerFlashDiv.appendChild(innerTextNode);

	flashMessageDiv.appendChild(innerFlashDiv);
	flashMessageDiv.setAttribute('id', 'flash-message');

	innerFlashDiv.setAttribute('class', 'alert alert-dark');
	document.getElementById('flash-messages').appendChild(flashMessageDiv);

	setFlashMessageFadeOut(flashMessageDiv);
}

// ----------------- End Search ---------------------------------

// --------------------- Flash Messages  ------------------------

function setFlashMessageFadeOut(flashElement) {
	setTimeout(() => {
		let currentOpacity = 1.0;
		let timer = setInterval(() => {
			if (currentOpacity <= 0.05) {
				clearInterval(timer);
				flashElement.remove();
			}
			currentOpacity -= 0.05;
			flashElement.style.opacity = currentOpacity;
		}, 50);
	}, 4000);
}

if (flashElement) {
	setFlashMessageFadeOut(flashElement);
}

// ----------------- End Flash Messages -------------------------

// --------------------- Commment Button  -----------------------

let commentBtn = document.getElementById('comment-btn');

function addMessage(data) {
	let template = document.createElement('template');

	template.innerHTML = `
	<div id='message-${data.commentId}'>
		<strong class='author-text'>@${data.username}</strong>
		<span class='date-posted'>${data.created}</span>
		<div class='comment-text'>${data.comment}</div>
	</div>
	`;

	document.getElementById('messages').firstChild.before(template.content);

	document.getElementById('comment-text-area').value = '';
}

if (commentBtn) {
	commentBtn.onclick = (e) => {
		let commentText = document.getElementById('comment-text-area').value;
		let postId = document.location.pathname.match(/\d+/g).map(Number)[0];

		if (!commentText) {
			return;
		}

		let fetchOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'Application/json',
			},
			body: JSON.stringify({
				comment: commentText,
				postId: postId,
			}),
		};

		fetch('/comments/create', fetchOptions)
			.then((response) => response.json())
			.then((data) => {
				if (data.code == 1) {
					addMessage(data);
				} else {
					addFlashFromFrontend(data.message, data.status);
				}
			})
			.catch((err) => console.log(err));
	};
}

// ----------------- End Commment Button ------------------------

// --------------------- Spinner -------------------------------

let loginBtn = document.getElementById('login-btnForm');
let loginForm = document.getElementById('login-formForm');
let regBtn = document.getElementById('submitBtn');
let regForm = document.getElementById('registration');
let uploadBtn = document.getElementById('upload-btn');
let uploadForm = document.getElementById('post-image');

if (loginBtn) {
	loginBtn.onclick = async () => {
		await spinner();
	};
}
if (loginForm) {
	loginForm.onsubmit = async () => {
		await spinner();
	};
}

if (uploadForm) {
	uploadForm.onsubmit = async () => {
		await spinner();
	};
}

if (regBtn) {
	regBtn.onlick = async () => {
		await spinner();
	};
}

if (regForm) {
	regForm.onsubmit = () => {
		let username = regForm.querySelector('input[name="username"]').value;

		validateUsername(username);
		iterateThroughArr(validationArr);

		if (validationFlag) {
			spinner();
		}
	};
}

// ----------------- End Spinner -------------------------------
