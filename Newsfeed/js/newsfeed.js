var fetchCount = 0;
var wait = false;

function loadAndShowPosts(){
	console.log("in loadandshow")
	wait = true;
	getPostsItems()
	.then(newsRaw => {
		//console.log(newsRaw)
		newsRaw.forEach(element => 
			
			createPost(element)
		);
	})
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
	/*let publisher = getPublisher(body.id)
	.then(publisher => {
		console.log(publisher)
		let div = document.createElement('div');
		let img = document.createElement('img');
		img.src = publisher.profile_image;
		img.classList.add('profile');
		div.appendChild(img);
		document.body.appendChild(div);
		console.log(body)
	})*/
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

	let title = document.createElement('p');
	let titleNode = document.createTextNode(body.title);
	title.appendChild(titleNode);
	title.classList.add('title');
	div.appendChild(title);

	document.getElementById('postsbox').appendChild(div);

	
	
	//img.src = 
	console.log("in createPost")
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(!wait){
        	loadAndShowPosts();
        }
    }
};



