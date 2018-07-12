var fetchCount = 0;
var wait = false;
var PAGE = "";
var checkProf = true; // user profile is complete
//global array of booleans for all the articles
var favs = {};
var user_id = "";
var token = "";

function checkLocalStorage(page) {
	console.log(localStorage.getItem("first_name"))
	PAGE = page;
	user_id = localStorage.getItem("user_id");
	token = localStorage.getItem("token");

	//this should be changed from an if/else chain into a switch
	//and done so that there isn't a second switch or chain in getpostitems
	if (PAGE == 'newsfeed') {
		loadProfile();
		loadAndShowPosts();
		//checkIfCompleteProfile();

	} else if (PAGE == 'favs') {
		loadAndShowPosts();
		loadProfile();
	} 
	else if (PAGE == 'profile') {
		console.log(PAGE);
		loadProfileData();
		loadProfile();

	} else if (PAGE == 'discover') {
		loadProfile();
	} else if (PAGE == 'explore') {
		loadProfile();
	} else if (PAGE == 'bob') {
		loadProfile();
	}
}

function loadAndShowPosts() {
	wait = true;
	document.getElementById('loading').classList.remove('hidden');
	getPostsItems()
		.then(newsRaw => {
			//console.log(newsRaw)
			newsRaw.forEach(element => {
				createPost(element);
			});
		}).then(res => {
			if (fetchCount > 1) {
				window.scrollBy({ top: 40, behavior: "smooth" });
			}
			document.getElementById('loading').classList.add('hidden');
		})
}

function getPostsItems() {

	let url = "";
	let body = {
		'offset': (fetchCount == 0 ? 1 : (12*fetchCount)+1),
		'limit': 12
	};
	
	if (PAGE == 'newsfeed') {
		url = "https://broadwayconnected.bubbleapps.io/api/1.1/wf/post_read";
		// url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/post_read";
	}
	if (PAGE == 'favs') {
		url = "https://broadwayconnected.bubbleapps.io/api/1.1/wf/favorite_read"
		// url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/favorite_read";
	}

	fetchCount += 1;

	let params = {
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		method: 'POST',
		body: JSON.stringify(body)
	}
	return fetch(url, params)
		.then(res => res.json())
		.then(body => {
			wait = false;
			console.log(body.response.post)
			return body.response.post;
		})
}

function loadProfile() {
	let div = document.getElementById('profile_pic');
	let pic = document.createElement('img');
	pic.classList.add('profile_pic');
	let source = localStorage.getItem('profile_image');
	pic.src = source;
	div.appendChild(pic);

	let namep = document.getElementsByClassName('navname')[0];
	let name = document.createTextNode(localStorage.getItem('first_name') + " " + localStorage.getItem('last_name'));
	namep.appendChild(name);
}


function favorite(post_id, liked) {
	//alert("totes fave" + id)
	let url = "https://broadwayconnected.bubbleapps.io/api/1.1/wf/favorite"
	// let url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/favorite"
	let body = { 
		'post_id': post_id,
		'liked': liked
	}
	console.log(token)
	var bearer = "Bearer " + token;
	let params = {
		headers: {
			'content-type': 'application/json',
			'Authorization': bearer
		},
		body: JSON.stringify(body),
		method: 'POST'
	}
	console.log(params)
	return fetch(url, params)
		.then(res => res.json());
}

function likesUpdate(post_id) {
	// let url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/post_read';
	let url = 'https://broadwayconnected.bubbleapps.io/api/1.1/wf/post_read';

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ 'post_id': post_id })
	})
	.then(res => res.json())
	.catch(error => console.error('Error:', error))
	.then(body => {
		if (body.status != "success") {
			console.log("request not successful");
			// createCustomAlert("WARNING: User Already Exists");
		} else {
			console.log("request successful")
			var likes = body.response.favoriters;
			let parent = document.getElementById(post_id);
			let fav_likes = parent.querySelector('.fav_likes');
			fav_likes.innerHTML = body.response.post.favoriters.length;
		}
	})
}


function showModal(body) {
	console.log("showModal",body);
	console.log(favs)

	// start building the modal
	var image_address = "";
	if(body.image){
		if(body.image.substr(0,4) == "data" || body.publisher_image.substr(0,4) == "http"){
			image_address = body.image;
		} else {
			image_address = "https:"+ body.image;
		}
	}

	var post_image = document.getElementsByClassName('modal-image');
	post_image[0].innerHTML = '<img src=' + image_address + '>';

	var profile_image_address = "body.publisher_image";
	if(body.publisher_image){
		if(body.publisher_image.substr(0,4) == "data" || body.publisher_image.substr(0,4) == "http"){
			image_address = body.publisher_image;
		} else {
			image_address = "https:"+ body.publisher_image;
		}
	}
	profile_image_address = image_address;
	// check if profile picture is default

	var profile_image = document.getElementsByClassName("modal-header");
	profile_image[0].innerHTML = '<img src=' + profile_image_address + '>';

	var publisher_name = document.getElementsByClassName("modal_h3");

	//var publisher_nameNode = document.createTextNode(body.publisher.first_name + ' ' + body.publisher.last_name);
	publisher_name[0].innerHTML = body.publisher_name;
	//publisher_name[0].appendChild(publisher_nameNode);

	var dateTime = new Date(body["Created Date"]);
	//var dateTime = dateTime.split(" ");
	var date1 = dateTime.toDateString();
	var time1 = dateTime.toTimeString();
	console.log("date1 ", date1)
	//var real_date = Date(date1);
	var real_date = date1.split(" ");
	var real_date0 = real_date[0];
	var real_date1 = real_date[1];
	var real_date2 = real_date[2];
	var really_real_date = [real_date0] + " " + [real_date1] + " " + [real_date2];
	console.log("really_real_date ", really_real_date)
	var date = document.getElementsByClassName("modal-date");
	date[0].innerHTML = dateTime.toDateString();
	 var time = document.getElementsByClassName("modal-time");
	time[0].innerHTML = time1;

	var time_split = time1.split(':');
	var hours = Number(time_split[0]);
	var minutes = Number(time_split[1]);
	//var seconds = Number(time_split[2]);
	var timeValue;

	if (hours > 0 && hours <= 12) {
		timeValue = "" + hours;
	} else if (hours > 12) {
		timeValue = "" + (hours - 12);
	} else if (hours == 0) {
		timeValue = "12";
	}

	timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
	//timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
	timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

	var timexxx = document.getElementsByClassName("modal-time");
	timexxx[0].innerHTML = timeValue;

	var title = document.getElementsByClassName("modal-title");
	title[0].innerHTML = body.title;

	var description = document.getElementsByClassName("modal-description");
	description[0].innerHTML = body.description;

	var url = body.source_url;
	var url_x = document.getElementById('modal-other');
	url_x.href = url;

	if (url == "") {
		document.getElementsByClassName("read_more")[0].style.display = "none";
	} else {
		document.getElementsByClassName('read_more')[0].style.display = "block";
		var url_x = document.getElementById('modal-other');
		url_x.href = url;
	}

	modal.style.display = "block";

	console.log(body)

	let fav_button = document.getElementById('modal-favorite-img')
	var liked = false;
	if (favs[body._id]) {
		console.log('this post is in favorites');
		fav_button.classList.add('modal-favorite-clicked');
		liked = true;
	} else {
		fav_button.classList.remove('modal-favorite-clicked');
		liked = false
	}

	let parent = document.getElementById(body._id);
	let fav_from_newsfeed = parent.querySelector('.favorite');
	let fav_likes = parent.querySelector('.fav_likes');

	fav_button.onclick = function (ev) {
		console.log("was it already liked?",liked)
		favorite(body._id, liked)
			.then(res => {
				console.log(body)
				if(res.response.post.favoriters.some(fav => fav == user_id)){
					var new_like = true;
					favs[res.response.post._id] = true;
				} else {
					var new_like = false;
					favs[res.response.post._id] = false;
				}
				likesUpdate(res.response.post._id);
				if (new_like) {
					var target = ev.srcElement || ev.target;
					target.classList.add('modal-favorite-clicked');
					// reflect this change on same article on Newsfeed
					fav_from_newsfeed.classList.add('favorite_click');
					liked = true;
				} else {
					var target = ev.srcElement || ev.target;
					target.classList.remove('modal-favorite-clicked');
					// reflect this change on same article on Newsfeed
					fav_from_newsfeed.classList.remove('favorite_click');
					liked = false;
				}
			})
	};

}

function createPost(body) {
	let div = document.createElement('div');
	div.classList.add('rcorners');

	let publisher_div = document.createElement('div');
	publisher_div.classList.add('publisher');
	publisher_div.classList.add('pointer');

	var image_address = "";

	let publisher_image = document.createElement('img');
	if (body.publisher_image){
		if(body.publisher_image.substr(0,4) == "data" || body.publisher_image.substr(0,4) == "http") {
			image_address = body.publisher_image;
		} else {
			image_address = "https:"+ body.publisher_image;
		}
		publisher_image.src = image_address;
	}
	
	publisher_image.classList.add('publisher_image');
	publisher_div.appendChild(publisher_image);
	image_address = "";

	// adding modal .click event
	publisher_div.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	let publisher_name = document.createElement('p');
	publisher_nameText = document.createTextNode(body.publisher_name);
	publisher_name.classList.add('publisher_name');

	publisher_name.appendChild(publisher_nameText);
	publisher_div.appendChild(publisher_name);

	div.appendChild(publisher_div);

	let center1 = document.createElement('center');
	center1.classList.add('pointer');

	// adding modal .click event
	center1.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	if(body.image){
		let main_image = document.createElement('img');

		if(body.image.substr(0,4) == "data" || body.image.substr(0,4) == "http"){
			image_address = body.image;
		} else {
			image_address = "https:"+ body.image;
		}
		main_image.src = image_address;
		main_image.classList.add('main_image');
		center1.appendChild(main_image);
	}

	image_address = "";
	div.appendChild(center1);

	let button_div = document.createElement('div');
	button_div.setAttribute("id", body._id);
	button_div.classList.add('button_row');

	let fav_button = document.createElement('img');
	fav_button.src = '../images/newsfeed_buttons/heart2.png';
	fav_button.classList.add('pointer');
	var liked = false;
	if(body.favoriters){
		if (body.favoriters.some(fav => fav == user_id)) {
			fav_button.classList.add('favorite_click');
			liked = true;
			favs[body._id] = true;
		} else {
			fav_button.classList.add('button');
			liked = false;
			favs[body._id] = false;
		}
	}
	fav_button.onclick = function (ev) {
		favorite(body._id, liked)
			.then(body => {
				console.log(body)
				if(body.response.post.favoriters.some(fav => fav == user_id)){
					var new_like = true;
				} else {
					var new_like = false;
				}
				if (body.status == "success") {
					likesUpdate(body.response.post._id);
				}
				if (new_like) {
					var target = ev.srcElement || ev.target
					target.classList.remove('button');
					target.classList.add('favorite_click');
					liked = true;
					favs[body.response.post._id] = true;
				} else {
					var target = ev.srcElement || ev.target
					target.classList.add('button');
					target.classList.remove('favorite_click');
					liked = false;
					favs[body.response.post._id] = false;
				}
			})
	};
	fav_button.classList.add('favorite');
	button_div.appendChild(fav_button);


	let fav_button_num = document.createElement('p');
	if(body.favoriters){
		var fav_button_numNode = document.createTextNode(body.favoriters.length);
	} else {
		var fav_button_numNode = document.createTextNode(0);
	}
	fav_button_num.appendChild(fav_button_numNode);
	fav_button_num.classList.add('fav_likes');
	button_div.appendChild(fav_button_num);


	let share_button = document.createElement('img');
	share_button.src = '../images/newsfeed_buttons/share.png';
	share_button.classList.add('button');
	button_div.appendChild(share_button)

	share_button.onclick = function (ev) {
		createCustomAlert("Sharing not currently available on web version, please download our IOS app");
	};

	let flag_button = document.createElement('img');
	flag_button.src = '../images/newsfeed_buttons/flag.png';
	flag_button.classList.add('button');
	button_div.appendChild(flag_button);

	flag_button.onclick = function (ev) {
		createCustomAlert("Flagged not currently available on web version, please download our IOS app");
	};

	let comment_button = document.createElement('img');
	comment_button.src = '../images/newsfeed_buttons/comment.png';
	comment_button.classList.add('comment_button');
	button_div.appendChild(comment_button);
	comment_button.onclick = function (ev) {
		createCustomAlert("Comments not currently available on web version, please download our IOS app");
		//setTimeout(function(){ createCustomAlert("Comments not currently available on web version, please download our IOS app").hide(); }, 1000,);

		//setTimeout(function () { $("#modalContainer").fadeOut(); }, 5000);
	};



	div.appendChild(button_div);

	var ALERT_BUTTON_TEXT = "x";
	if (document.getElementById) {
		window.alert = function (txt) {
			createCustomAlert(txt);
		}
	}




	let title = document.createElement('p');
	let titleNode = document.createTextNode(body.title);
	title.appendChild(titleNode);
	title.classList.add('title');
	title.classList.add('pointer');
	div.appendChild(title);

	// adding modal .click event
	title.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	let description = document.createElement('p');
	let descriptionNode = document.createTextNode(body.description);
	description.appendChild(descriptionNode);
	description.classList.add('description');
	description.classList.add('ellipsis');
	description.classList.add('pointer');
	div.appendChild(description);

	// adding modal .click event
	description.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	document.getElementById('postsbox').appendChild(div);

	//img.src = 
}

window.onscroll = function (ev) {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		if (!wait) {
			loadAndShowPosts()
		}
	}
};
