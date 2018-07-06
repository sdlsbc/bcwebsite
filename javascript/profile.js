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

    var url = "http://app.bwayconnected.com/api/user/profile?user_id="+user_id+"&profile_id=67";
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

    let titleAndTime = document.createElement('div');
    titleAndTime.classList.add('titleAndTime');

    let title = document.createElement('p');
    let titleNode = document.createTextNode(body.title);
    title.appendChild(titleNode);
    title.classList.add('userfeed-title');
    titleAndTime.appendChild(title);

    let time = document.createElement('div');
    time.classList.add('time');
    let clock = document.createElement('img');
    clock.src = '../images/clock.png';
    clock.classList.add('clock');
    time.appendChild(clock);

    titleAndTime.appendChild(time);

    div.appendChild(titleAndTime);

    let description = document.createElement('p');
    let descriptionNode = document.createTextNode(body.description);
    description.appendChild(descriptionNode);
    description.classList.add('userfeed-description');
    div.appendChild(description);

    document.getElementById('profile-postsbox').appendChild(div);
}





