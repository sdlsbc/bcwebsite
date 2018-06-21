var divs = ["profile-postsbox", "profile-calendar", "profile-followers", "profile-following"];
var visibleDivId = null;
function toggleVisibility(divId) {
  if(visibleDivId === divId) {
    //visibleDivId = null;
  } else {
    visibleDivId = divId;
  }
  hideNonVisibleDivs();
}
function hideNonVisibleDivs() {
  var i, divId, div;
  for(i = 0; i < divs.length; i++) {
    divId = divs[i];
    div = document.getElementById(divId);
    if(visibleDivId === divId) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  }
}



function checkBrowser(){
    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
    {
        alert('Opera');
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        alert('Chrome');
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        alert('Safari');
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
         alert('Firefox');
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
      alert('IE'); 
    }  
    else 
    {
       alert('unknown');
    }
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

function loadAndShowPosts(){
    console.log("This is the /'main/'");
    loadProfileData();
    getPostsItems()
        .then(newsRaw => {
            var oldDate = new Date();
            newsRaw.forEach(element => {
                var newDate = new Date(Date.parse(element.published_date));
                newDate.setHours(0,0,0,0)

                if(newDate < oldDate){
                    oldDate = newDate;
                    let date = document.createElement('h3');
                    //let dateObj = new Date(Date.parse(body.published_date));
                    let dateNode = document.createTextNode(oldDate.toDateString());
                    date.appendChild(dateNode);
                    document.getElementById('profile-postsbox').appendChild(date);
                }

                createPost(element);

            })
        })
}

function getPostsItems(){
    let user_id = localStorage.getItem("user_id");

    var url = "http://app.bwayconnected.com/api/user/profile?user_id="+user_id+"&profile_id=12";
    let params = {
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET'
    };
    return fetch(url, params)
        .then(res => res.json())
        .then(body => body.Result.articles)
}

function createPost(body){

    let div = document.createElement('div');
    div.classList.add('userfeed-post');

    let publisher_div = document.createElement('div');
    publisher_div.classList.add('publisher');

    let publisher_image = document.createElement('img');
    if (body.publisher.profile_image == "http://app.bwayconnected.com/public/images/default.jpg") {
        publisher_image.src = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
    } else {
        publisher_image.src = body.publisher.profile_image;
    }
    publisher_image.classList.add('userfeed-publisher-image');
    publisher_div.appendChild(publisher_image);

    let name = document.createElement('p');
    let nameNode = document.createTextNode(body.publisher.first_name+" "+body.publisher.last_name)
    name.appendChild(nameNode);
    name.classList.add('userfeed-name');

    publisher_div.appendChild(name);

    div.appendChild(publisher_div);

    let image_div = document.createElement('div');
    let image = document.createElement('img');
    if(body.post_image == "http://app.bwayconnected.com/public/images/articles/default.jpg"){
        image.src = "http://app.bwayconnected.com/public/images/articles/unHla8zj9ZQK.jpg"
    }else{
        image.src = body.post_image;
    }
    console.log(body.post_image);
    image.classList.add('userfeed-image');
    image_div.appendChild(image);
    div.appendChild(image_div);

    let button_row = document.createElement('div');
    button_row.classList.add('button-row');

      let favorite = document.createElement('div');
      favorite.classList.add('userfeed-favorite');
      let heart = document.createElement('img');
      heart.src = '../images/newsfeed_buttons/heart2.png';
      heart.classList.add('heart');
      favorite.appendChild(heart);
      button_row.appendChild(favorite);


      let favorite_num = document.createElement('p');
      let favorite_numText = document.createTextNode(body.likes);
      favorite_num.appendChild(favorite_numText);
      favorite.appendChild(favorite_num);

      div.appendChild(favorite);
      // button_row.appendChild(favorite_num);

      let comment = document.createElement('div');
      comment.classList.add('comment');
      let comment_box = document.createElement('img');
      comment_box.src = '../images/newsfeed_buttons/comment.png';
      comment_box.classList.add('comment_box');
      div.appendChild(comment_box);

      let share = document.createElement('div');
      share.classList.add('share');
      let share_icon = document.createElement('img');
      share_icon.src = '../images/newsfeed_buttons/share.png';
      share_icon.classList.add('share_icon');
      div.appendChild(share_icon);

      let flag = document.createElement('div');
      flag.classList.add('flag');
      let flag_icon = document.createElement('img');
      flag_icon.src = '../images/newsfeed_buttons/flag.png';
      flag_icon.classList.add('flag_icon');
      div.appendChild(flag_icon);

      let time = document.createElement('div');
      time.classList.add('time');
      let clock = document.createElement('img');
      clock.src = '../images/clock.png';
      clock.classList.add('clock');
      time.appendChild(clock);

      let timeSince = document.createElement('p');
      let timeSinceText = document.createTextNode(howLongAgo(body.published_date));
      timeSince.appendChild(timeSinceText);
      time.appendChild(timeSince);

      div.appendChild(time);

    let title = document.createElement('p');
    let titleNode = document.createTextNode(body.title);
    title.appendChild(titleNode);
    title.classList.add('userfeed-title');
    div.appendChild(title);

    let description_div = document.createElement('div');

    let description = document.createElement('p');
    let descriptionNode = document.createTextNode(body.description);
    description.appendChild(descriptionNode);
    description.classList.add('userfeed-description');
    description.classList.add('hidden-post');
    description.id = body.id;

    description_div.appendChild(description);

    let readMore = document.createElement('BUTTON');
    let readMoreNode = document.createTextNode('Read More');
    readMore.appendChild(readMoreNode);
    description_div.appendChild(readMore)

    readMore.onclick = function(ev) {
        var target = ev.srcElement || ev.target;
        if(target.textContent == "Read More") {
            document.getElementById(body.id).classList.remove('hidden-post');
            target.textContent = "Read Less";
        } else {
            document.getElementById(body.id).classList.add('hidden-post');
            target.textContent = "Read More";
        }
    }

    div.appendChild(description_div);

    document.getElementById('profile-postsbox').appendChild(div);
}

function howLongAgo(date){
    let now = new Date();
    let postDate = new Date(Date.parse(date));
    let years = DateDiff('yyyy', postDate, now);
    if(years >= 1){
        if(years == 1){
            return "1 year ago"
        }
        return years + " years ago"
    }

    let months = DateDiff('m', postDate, now);
    if(months >= 1){
        if(months == 1){
            return "1 month ago"
        }
        return months + " months ago"
    }
    
    let days = DateDiff('d', postDate, now);
    if(days >= 1){
        if(days == 1){
            return "1 day ago"
        }
        return days + " days ago"
    }
    return "Just now"
}





