var fetchCount = 0;
var wait = false;
var PAGE = "";

function checkLocalStorage(page) {
	//if (localStorage.getItem("user_id") == null)
	//{
	//alert("Please Sign Up First");
	//redirect to login page

	//window.location.href = "../../index.html";
	PAGE = page;

	if (PAGE == 'profile'){
		console.log(PAGE);
		loadProfileData();
		loadProfile();

	}
	//}else{
	//local storage value"+localStorage.getItem("user_id");
	loadAndShowPosts();
	//}
	loadProfile();

}

function loadAndShowPosts() {
	wait = true;
	document.getElementById('loading').classList.remove('hidden');
	getPostsItems()
		.then(newsRaw => {
			//console.log(newsRaw)
			newsRaw.forEach(element =>
				createPost(element)
			);
		}).then(res => {
			if (fetchCount > 1) {
				window.scrollBy({ top: 40, behavior: "smooth" });
			}
			document.getElementById('loading').classList.add('hidden');
		})
}

function getPostsItems() {
	let url = "http://app.bwayconnected.com/api/";
	if (PAGE == 'new') {
		url = url + "posts?offset=" + (12 * fetchCount) + "&limit=12";
	}
	if (PAGE == 'fav') {
		let user_id = localStorage.getItem("user_id");
		url = url + "post/favourites?user_id=" + user_id + "&offset=" + (12 * fetchCount) + "&limit=12";
	}
	fetchCount += 1;
	//url = url + offset;
	let params = {
		headers: {
			'content-type': 'application/json'
		},
		method: 'GET'
	}

	return fetch(url, params)
		.then(res => res.json())
		.then(body => {
			wait = false;
			return body.Result.Posts;
		})
}

function loadProfile() {
	let div = document.getElementById('profile_pic');
	let pic = document.createElement('img');
	pic.classList.add('profile_pic');
	let source = localStorage.getItem('profile_image');

	if (source == "http://app.bwayconnected.com/public/images/default.jpg") {
		pic.src = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
	} else {
		pic.src = source;
	}

	div.appendChild(pic);

	let namep = document.getElementsByClassName('navname')[0];
	let name = document.createTextNode(localStorage.getItem('first_name') + " " + localStorage.getItem('last_name'));
	namep.appendChild(name);
}


function favorite(post_id) {
	//alert("totes fave" + id)
	let user_id = localStorage.getItem("user_id");
	let url = "http://app.bwayconnected.com/api/post/favourite?user_id=" + user_id + "&post_id=" + post_id;
	let params = {
		headers: {
			'content-type': 'application/json'
		},
		method: 'POST'
	}
	console.log(url)
	return fetch(url, params)
		 .then(res => res.json());
		
}

function likesUpdate(post_id) {
console.log('update likes post id ',post_id);
	let url = 'http://app.bwayconnected.com/api/post/detail?post_id=' + post_id;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => res.json())
		.catch(error => console.error('Error:', error))
		.then(response => {

			if (response.Response == "1000") {
				console.log("request not successful");
				// createCustomAlert("WARNING: User Already Exists");
			} else {
				console.log('Success in likes likesUpdate:', response)
				var body = response.Result;
				var likes = body.Posts[0].likes;
				console.log('Likes are', likes)

				let parent = document.getElementById(post_id);
				console.log('post id in likes', post_id)
				let fav_likes = parent.querySelector('.fav_likes');
				fav_likes.innerHTML = likes;

			}
	})
	// console.log('in likes update');
}


function showModal(body) {
	let user_id = localStorage.getItem("user_id");

	//fetch fresh data from api to display in Modal

	var url = 'http://app.bwayconnected.com/api/post/detail?post_id=' + body.id;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => res.json())
		.catch(error => console.error('Error:', error))
		.then(response => {

			if (response.Response == "1000") {
				console.log("request not successful");
				// createCustomAlert("WARNING: User Already Exists");
			} else {
				console.log('Success:', response)
				var body = response.Result;

				// start building the modal

				var img_address = body.Posts[0].post_image;
				var post_image = document.getElementsByClassName('modal-image');
				post_image[0].innerHTML = '<img src=' + img_address + '>';

				var profile_image_address = body.Posts[0].publisher.profile_image;

				// check if profile picture is default
				if (profile_image_address == "http://app.bwayconnected.com/public/images/default.jpg") {
					profile_image_address = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
				}

				var profile_image = document.getElementsByClassName("modal-header");
				profile_image[0].innerHTML = '<img src=' + profile_image_address + '>';

				var publisher_name = document.getElementsByClassName("modal_h3");
				publisher_name[0].innerHTML = body.Posts[0].publisher.first_name + ' ' + body.Posts[0].publisher.last_name;


				var dateTime = body.Posts[0].published_date;
				var dateTime = dateTime.split(" ");
				var date1 = dateTime[0];
				var time1 = dateTime[1];

				var real_date = Date(date1);
				var real_date = real_date.split(" ");
				var real_date0 = real_date[0];
				var real_date1 = real_date[1];
				var real_date2 = real_date[2];
				var really_real_date = [real_date0] + " " + [real_date1] + " " + [real_date2];

				var date = document.getElementsByClassName("modal-date");
				date[0].innerHTML = really_real_date;
				//  var time = document.getElementsByClassName("modal-time");
				// time[0].innerHTML = time1;

				var time_split = time1.split(':');
				var hours = Number(time_split[0]);
				var minutes = Number(time_split[1]);
				var seconds = Number(time_split[2]);

				var timeValue;

				if (hours > 0 && hours <= 12) {
					timeValue = "" + hours;
				} else if (hours > 12) {
					timeValue = "" + (hours - 12);
				} else if (hours == 0) {
					timeValue = "12";
				}

				timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
				// timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
				timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

				var timexxx = document.getElementsByClassName("modal-time");
				timexxx[0].innerHTML = timeValue;

				var title = document.getElementsByClassName("modal-title");
				title[0].innerHTML = body.Posts[0].title;

				var description = document.getElementsByClassName("modal-description");
				description[0].innerHTML = body.Posts[0].description;

				var url = body.Posts[0].source_url;
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

				let fav_button = document.getElementById('modal-favorite-img')

				if (body.Posts[0].favourites.some(fav => fav.user_id == user_id)) {
					// console.log('this post is in favorites');
					fav_button.classList.add('modal-favorite-clicked');
				}else{
					fav_button.classList.remove('modal-favorite-clicked');
				}

				let parent = document.getElementById(body.Posts[0].id);
				let fav_from_newsfeed = parent.querySelector('.favorite');
				let fav_likes = parent.querySelector('.fav_likes');
				// var post_id_to_use = 
				fav_button.onclick = function (ev) {
					favorite(body.Posts[0].id)
						.then(body => {
							console.log('body',body);
							if (body.Response == "2000") {
								likesUpdate(body.Result.Posts[0].id);
							}
							if (body.Message === "Added to user favourite successfully") {
								var target = ev.srcElement || ev.target;
								target.classList.add('modal-favorite-clicked');
								// reflect this change on same article on Newsfeed
								fav_from_newsfeed.classList.add('favorite_click');
							} else {
								var target = ev.srcElement || ev.target;
								target.classList.remove('modal-favorite-clicked');
								// reflect this change on same article on Newsfeed
								fav_from_newsfeed.classList.remove('favorite_click');
							}
						})
				};
			}
		})
}

function createPost(body) {
	// console.log(body)
	let div = document.createElement('div');
	div.classList.add('rcorners');

	let publisher_div = document.createElement('div');
	publisher_div.classList.add('publisher');

	let publisher_image = document.createElement('img');
	if (body.publisher.profile_image == "http://app.bwayconnected.com/public/images/default.jpg") {
		publisher_image.src = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
	} else {
		publisher_image.src = body.publisher.profile_image;
	}
	publisher_image.classList.add('publisher_image');
	publisher_div.appendChild(publisher_image);

	// adding modal .click event
	publisher_div.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	let publisher_name = document.createElement('p');
	publisher_nameText = document.createTextNode(body.publisher.first_name + " " + body.publisher.last_name);
	publisher_name.classList.add('publisher_name');

	publisher_name.appendChild(publisher_nameText);
	publisher_div.appendChild(publisher_name);

	div.appendChild(publisher_div);

	let center1 = document.createElement('center');

	// adding modal .click event
	center1.onclick = (function () {
		var currentI = body;
		return function () {
			showModal(currentI);
		}
	})();
	//adding modal .click end

	let main_image = document.createElement('img');
	main_image.src = body.post_image;
	main_image.classList.add('main_image')
	center1.appendChild(main_image);
	div.appendChild(center1);

	let button_div = document.createElement('div');
	button_div.setAttribute("id", body.id);
	button_div.classList.add('button_row');

	let user_id = localStorage.getItem("user_id");
	let fav_button = document.createElement('img');
	// fav_button.setAttribute("id", body.id);
	fav_button.src = '../images/newsfeed_buttons/heart2.png';
	if (body.favourites.some(fav => fav.user_id == user_id)) {
		fav_button.classList.add('favorite_click');
	} else {
		fav_button.classList.add('button');
	}
	fav_button.onclick = function (ev) {
		favorite(body.id)
			.then(body => {
				console.log('body of Create Post',body);
				if (body.Response == "2000") {
					likesUpdate(body.Result.Posts[0].id);
				}
				if (body.Message === "Added to user favourite successfully") {
					var target = ev.srcElement || ev.target
					target.classList.remove('button');
					target.classList.add('favorite_click');

				} else {
					var target = ev.srcElement || ev.target
					target.classList.add('button');
					target.classList.remove('favorite_click');

				}
			})
	};
	fav_button.classList.add('favorite');
	button_div.appendChild(fav_button);


	let fav_button_num = document.createElement('p');
	let fav_button_numNode = document.createTextNode(body.likes);
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

  	comment_button.onclick = function(ev) {
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

function loadProfileData(){
	console.log('in loadProfileData');
	// let user_id = localStorage.getItem("user_id");
	let user_id = 12;
// http://app.bwayconnected.com/api/user/profile?user_id=12&profile_id=12
	//api call and get data

let url = 'http://app.bwayconnected.com/api/user/profile?user_id='+user_id+'&profile_id='+user_id;

	fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(res => res.json())
		.catch(error => console.error('Error:', error))
		.then(response => {

			if (response.Response == "1000") {
				console.log("request not successful in loadProfileData");
				// createCustomAlert("WARNING: User Already Exists");
			} else {
				console.log('Success in loadProfileData', response)
				var body = response.Result.profile;
				var fn = body.first_name;
				var ln = body.last_name;
				var handle = body.handle;
				var profile_image = body.profile_image;
				var headline_position = body.headline_position;
				console.log('profile image url',profile_image);
				document.getElementById('name').innerHTML = fn;
				document.getElementById('username').innerHTML = handle;
				document.getElementById('headline_position').innerHTML = headline_position;
				var user_img = document.getElementsByClassName('user_img');
				user_img.innerHTML = '<img src=' + profile_image + '>';
				
				var field_of_work = body.field_of_work;
				var location = body.city+","+body.country;

				var user_img = document.getElementById("user_img");
				user_img.innerHTML = '<img src=' + profile_image + '>';
				document.getElementById('name').innerHTML = fn;
				document.getElementById('user_type').innerHTML = field_of_work;
				document.getElementById('location').innerHTML = location;
				console.log('fn is', fn);

			}
	})

	
}



window.onscroll = function (ev) {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		if (!wait) {
			loadAndShowPosts()
		}
	}
};



