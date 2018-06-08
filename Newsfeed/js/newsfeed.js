var fetchCount = 0;
var wait = false;

function checkLocalStorage(){
	//if (localStorage.getItem("user_id") == null)
	//{
		//alert("Please Sign Up First");
		 //redirect to login page

		//window.location.href = "../../index.html";

	//}else{
		//local storage value"+localStorage.getItem("user_id");
		loadAndShowPosts();
	//}
}

function loadAndShowPosts(){
	console.log("in loadandshow")
	wait = true;
	document.getElementById('loading').classList.remove('hidden');
	getPostsItems()
	.then(newsRaw => {
		//console.log(newsRaw)
		newsRaw.forEach(element => 
			createPost(element)
		);
	}).then(res => {
		if(fetchCount > 1){
			window.scrollBy({ top: 40, behavior: "smooth"});
		}
		document.getElementById('loading').classList.add('hidden');
	})

}

function favorite(post_id){
	//alert("totes fave" + id)
	let user_id = localStorage.getItem("user_id");
	let url = "http://app.bwayconnected.com/api/post/favourite?user_id=" + user_id + "&post_id=" + post_id;
	let params = {
		headers: {
			'content-type': 'application/json'
		},
		method: 'POST'
	}
	return fetch(url, params)
	.then(res => res.json())
}

function getPostsItems(){

	let url = "http://app.bwayconnected.com/api/posts?offset="+(12*fetchCount)+"&limit=12";
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


function createPost(body){

	let div = document.createElement('div');
	div.classList.add('rcorners');

	let publisher_image = document.createElement('img');
	if(body.publisher.profile_image == "http://app.bwayconnected.com/public/images/default.jpg"){
		publisher_image.src = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
	} else {
		publisher_image.src = body.publisher.profile_image;
	}
	publisher_image.classList.add('publisher_image');

	div.appendChild(publisher_image);
	div.appendChild(document.createElement('br'));



	let center1 = document.createElement('center');

	let main_image = document.createElement('img');
	main_image.src = body.post_image;
	main_image.classList.add('main_image')
	center1.appendChild(main_image);
	div.appendChild(center1);

	let button_div = document.createElement('div');
	button_div.classList.add('button_row');


	let user_id = localStorage.getItem("user_id");
	let fav_button = document.createElement('img');
	fav_button.src = '../images/newsfeed_buttons/heart2.png';
	if(body.favourites.some(fav =>  fav.user_id == user_id)){
		fav_button.classList.add('favorite_click');
	} else {
		fav_button.classList.add('button');
	}
	fav_button.onclick = function(ev) { 
		favorite(body.id)
		.then(body => {
			if(body.Message === "Added to user favourite successfully"){
				ev.srcElement.classList.remove('button');
				ev.srcElement.classList.add('favorite_click');
			} else {
				ev.srcElement.classList.add('button');
				ev.srcElement.classList.remove('favorite_click');
			}
		})
	};
	fav_button.classList.add('favorite');
	button_div.appendChild(fav_button);

	let share_button = document.createElement('img');
	share_button.src = '../images/newsfeed_buttons/share.png';
	share_button.classList.add('button');
	button_div.appendChild(share_button)

	let flag_button = document.createElement('img');
	flag_button.src = '../images/newsfeed_buttons/flag.png';
	flag_button.classList.add('button');
	button_div.appendChild(flag_button);

	let comment_button = document.createElement('img');
	comment_button.src = '../images/newsfeed_buttons/comment.png';
	comment_button.classList.add('button');
	button_div.appendChild(comment_button);

	div.appendChild(button_div);

	let title = document.createElement('p');
	let titleNode = document.createTextNode(body.title);
	title.appendChild(titleNode);
	title.classList.add('title');
	div.appendChild(title);

	let description = document.createElement('p');
	let descriptionNode = document.createTextNode(body.description);
	description.appendChild(descriptionNode);
	description.classList.add('description');
	div.appendChild(description);

	document.getElementById('postsbox').appendChild(div);

	
	
	//img.src = 
	console.log("in createPost")
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(!wait){
        	loadAndShowPosts()
        }
    }
};



