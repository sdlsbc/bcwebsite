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

function loadAndShowPosts(){
    console.log("This is the /'main/'");
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
    image.src = body.post_image;
    image.classList.add('userfeed-image');
    image_div.appendChild(image);
    div.appendChild(image_div);

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

    description_div.appendChild(description);

    let readMore = document.createElement('BUTTON');
    let readMoreNode = document.createTextNode('Read More');
    readMore.appendChild(readMoreNode);
    description_div.appendChild(readMore)

    readMore.onclick = function(ev) {
        ev.srcElement.parentElement.classList.add('revealed-post');
        ev.srcElement.parentElement.classList.remove('hidden-post');
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





