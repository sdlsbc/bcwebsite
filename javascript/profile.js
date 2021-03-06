// var divs = ["profile-postsbox", "profile-calendar", "profile-followers", "profile-following", "profile-moments", "profile-article"];
var divs = ["profile-postsbox", "profile-calendar", "profile-followers", "profile-following"];

var visibleDivId = null;
var followers = false;
var followings = false;
var user_id = localStorage.getItem("user_id");
// var visiting = getParameterByName('user_id');
if (getParameterByName('user_id') != "" || getParameterByName('user_id') != null) {
    var visiting = getParameterByName('user_id');
}
var token = localStorage.getItem("token");
var favs = {};

console.log("looky looky what went through ", localStorage.getItem("headline"),
    localStorage.getItem("job_title"),
    localStorage.getItem("job_company"),
    localStorage.getItem("prev_job"),
    localStorage.getItem("prev_company"))


function toggleAndLoadFollowers() {
    toggleVisibility('profile-followers');
    if (followers == false) {
        followers = true;
    }
    else {
        return;
    }

    token = localStorage.getItem("token");
    user_id_current = localStorage.getItem("user_id");

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_currentuser_followers";

    var data = {
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            // console.log(response);
            if (response.status == "success") {

                // console.log('all following',response.response.following);
                showFollowingCurrentUserProfile(response.response.followers, "followers");
            }
        })

}

function toggleAndLoadFollowings() {
    toggleVisibility('profile-following');
    if (followings == false) {
        followings = true;
    }
    else {
        return;
    }

    token = localStorage.getItem("token");
    console.log(token)
    user_id_current = localStorage.getItem("user_id");

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_currentuser_following";

    var data = {
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            // console.log(response);
            if (response.status == "success") {

                // console.log('all following',response.response.following);
                showFollowingCurrentUserProfile(response.response.following, "following");
            }
        })
}

function toggleVisibility(divId) {
    if (visibleDivId === divId) {
        //visibleDivId = null;
    } else {
        visibleDivId = divId;
    }
    hideNonVisibleDivs();
}
function hideNonVisibleDivs() {
    var i, divId, div;
    for (i = 0; i < divs.length; i++) {
        divId = divs[i];
        div = document.getElementById(divId);
        if (visibleDivId === divId) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}



function checkBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        alert('Opera');
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
        alert('Chrome');
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        alert('Safari');
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        alert('Firefox');
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        alert('IE');
    }
    else {
        alert('unknown');
    }
}

function loadUserData() {

    loadAndShowPostsNew();
    loadAndShowFollowingFollowerNumbers();
    // loadProfileData();
    // fillProfileEditor();
}



function loadProfileData() {
    //loadProfile();
    console.log('in loadProfileData');
    //api call and get data

    let url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/user_read";
    let body = {}
    if (visiting == "") {
        console.log("this is yours")
        body = {
            "user_id": user_id
        }
    } else {
        console.log("visiting someone else")
        body = {
            "user_id": visiting
        }
    }
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(body => {

            if (body.status != "success") {
                console.log("request not successful in loadProfileData");
                // createCustomAlert("WARNING: User Already Exists");
            } else {
                console.log('Success in loadProfileData', body)
                let company = body.response.company;
                let production = body.response.production;
                let user = body.response.user;
                let personal = body.response.personal;


                switch (user.usertype) {
                    case "company":
                        console.log("this is a company");
                        break;
                    case "production":
                        console.log("this one's a company");
                        break;
                    case "personal":
                        console.log("just some dude");
                        break;
                }
                let profile_image_el = document.createElement('img');
                let profile_image = "";
                if (!user.image) {
                    console.log("put the default in here")
                    profile_image = "../images/default-person.png"
                }
                if (!(user.image == null || user.image == "")) {
                    if (user.image.substr(0, 4) == "data" || user.image.substr(0, 4) == "http") {
                        profile_image = user.image;
                    } else {
                        profile_image = "https:" + user.image;
                    }
                }

                profile_image_el.src = profile_image;
                document.getElementById("user_img").appendChild(profile_image_el);

                let location = document.createTextNode(user.city + ", " + user.country);
                document.getElementById("location").appendChild(location);


                document.getElementById('name').appendChild(document.createTextNode(user.firstname + " " + user.lastname));
                document.getElementById('username').innerHTML = user.handle;
                var user_img = document.getElementsByClassName('user_img');
                // user_img.innerHTML = '<img src=' + profile_image + '>';


            }
        })
}

function loadAndShowPostsNew() {
    document.getElementById('profile-postsbox').innerHTML = "";

    // getMilestoneItemsNew();
    get_userfeed();
    // getPostsItemsNew()
    //     .then(newsRaw => {
    //         console.log('response from getPostsIetms', newsRaw)
    //         var oldDate = new Date();
    //         newsRaw.forEach(element => {
    //             var newDate = new Date(element["Created Date"]);
    //             newDate.setHours(0, 0, 0, 0)

    //             if (newDate < oldDate) {
    //                 oldDate = newDate;
    //                 let date = document.createElement('h3');
    //                 //let dateObj = new Date(Date.parse(body.published_date));
    //                 let dateNode = document.createTextNode(oldDate.toDateString());
    //                 date.appendChild(dateNode);
    //                 document.getElementById('profile-postsbox').appendChild(date);
    //             }
    //             createUserFeedArticles(element);
    //         })
    //     })


}

function getPostsItemsNew() {
    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/post_read";
    var user_id_current = localStorage.getItem("user_id");
    console.log('user_id_current : ', user_id_current);
    let body = {
        "user_id": user_id_current
    }
    // if (visiting == "") {
    //     console.log("this is yours")
    //     body = {
    //         "user_id": user_id
    //     }
    // } else {
    //     console.log("visiting someone else")
    //     body = {
    //         "user_id": visiting
    //     }
    // }
    let params = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(body)
    };
    // console.log(url);
    return fetch(url, params)
        .then(res => res.json())
        .then(body => {
            console.log('this is user posts', body.response.post)
            return body.response.post
        })
}


function get_userfeed() {

    console.log(' in get userfeed');
    var token = localStorage.getItem("token");
    var user_id_current = localStorage.getItem("user_id");


    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_userfeed";

    let body = {
    }

    let params = {
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(body)
    };
    return fetch(url, params)
        .then(res => res.json())
        .then(body => {
            // console.log('this is user feed list', body.response.feed);

            // now get data for each element

            var userfeedlist = body.response.feed;


            userfeedlist.forEach(element => {

                // console.log(element);

                // fetch call

                var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_unique_id_item";

                let body = {
                    "UI": element
                }

                let params = {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    method: 'POST',
                    body: JSON.stringify(body)
                };
                return fetch(url, params)
                    .then(res => res.json())
                    .then(body => {
                        console.log('fetching each userfeed element : ', body.response);
                        // check what kind of response it is (post /  milestone)

                        var oldDate = new Date();
                        if (body.response.post !== undefined) {

                            var newDate = new Date(body.response.post["Created Date"]);
                            newDate.setHours(0, 0, 0, 0)

                            // if (newDate < oldDate) {
                            //     oldDate = newDate;
                            //     let date = document.createElement('h3');
                            //     //let dateObj = new Date(Date.parse(body.published_date));
                            //     let dateNode = document.createTextNode(oldDate.toDateString());
                            //     date.appendChild(dateNode);
                            //     document.getElementById('profile-postsbox').appendChild(date);
                            // }
                            createUserFeedArticles(body.response.post);

                            // createElementForUserfeed_Article();
                        }
                        if (body.response.milestones !== undefined) {
                            var newDate = new Date(body.response.milestones["Created Date"]);
                            newDate.setHours(0, 0, 0, 0)

                            // if (newDate < oldDate) {
                            //     oldDate = newDate;
                            //     let date = document.createElement('h3');
                            //     //let dateObj = new Date(Date.parse(body.published_date));
                            //     let dateNode = document.createTextNode(oldDate.toDateString());
                            //     date.appendChild(dateNode);
                            //     document.getElementById('profile-postsbox').appendChild(date);
                            // }
                            // createUserFeedArticles(element);
                            createElementForUserfeed_Milestones(body.response.milestones);
                        }
                    })


            });


            // document.getElementById('profile-postsbox').innerHTML = body.response;
            // return body.response.post
        })
}


// create A Article on Userfeed

function createElementForUserfeed_Article() {
    console.log('creating a article');
}

// create A Milestone on Userfeed

function createElementForUserfeed_Milestones(body) {
    console.log('creating a milestone');

    let div = document.createElement('div');
    div.classList.add('milestone-post');

    let publisher_div = document.createElement('div');
    publisher_div.classList.add('publisher');

    let publisher_image = document.createElement('img');

    publisher_image.src = body.publisher_image;
    publisher_image.classList.add('milestone-publisher-image');
    publisher_div.appendChild(publisher_image);

    let name = document.createElement('p');
    let nameNode = document.createTextNode(body.publisher_name)
    name.appendChild(nameNode);
    name.classList.add('milestone-name');

    publisher_div.appendChild(name);

    div.appendChild(publisher_div);

    let image_div = document.createElement('div');
    let image = document.createElement('img');

    // get milestone image
    switch (body.type) {
        case "Casted as Photo":
            image.src = "../images/milestones-img1.png";
            break;

        case "First Rehearsal":
            image.src = "../images/milestones-img2.png";
            break;

        case "Opening Night":
            image.src = "../images/milestones-img3.png";
            break;

        case "First Day Of Work":
            image.src = "../images/milestones-img4.png";
            break;

        case "First Broadway Show":
            image.src = "../images/milestones-img5.png";
            break;

        case "Audition":
            image.src = "../images/milestones-img6.png";
            break;

        case "Call Back":
            image.src = "../images/milestones-img7.png";
            break;

        case "Offer":
            image.src = "../images/milestones-img8.png";
            break;
    }


    // image.src = body.image;
    image.classList.add('milestone-image');
    image_div.appendChild(image);
    div.appendChild(image_div);

    let button_row = document.createElement('div');
    button_row.classList.add('button-row');

    let favorite = document.createElement('div');
    favorite.classList.add('milestone-favorite');
    let heart = document.createElement('img');
    heart.src = '../images/newsfeed_buttons/heart2.png';
    heart.classList.add('heart');
    favorite.appendChild(heart);
    button_row.appendChild(favorite);

    // if(body.favoriters){
    //     if (body.favoriters.some(fav => fav == user_id)) {
    //         fav_button.classList.add('favorite_click');
    //         liked = true;
    //         favs[body._id] = true;
    //     } else {
    //         fav_button.classList.add('button');
    //         liked = false;
    //         favs[body._id] = false;
    //     }
    // }


    let favorite_num = document.createElement('p');

    if (body.favoriters) {
        var fav_button_numNode = document.createTextNode(body.favoriters.length);
    } else {
        var fav_button_numNode = document.createTextNode(0);
    }
    favorite_num.appendChild(fav_button_numNode);
    favorite.appendChild(favorite_num);

    div.appendChild(favorite);
    // button_row.appendChild(favorite_num);

    let share = document.createElement('div');
    share.classList.add('share');
    let share_icon = document.createElement('img');
    share_icon.src = '../images/newsfeed_buttons/share.png';
    share_icon.classList.add('share_icon');
    div.appendChild(share_icon);

    let comment = document.createElement('div');
    comment.classList.add('comment');
    let comment_box = document.createElement('img');
    comment_box.src = '../images/newsfeed_buttons/comment.png';
    comment_box.classList.add('comment_box');
    div.appendChild(comment_box);

    let flag = document.createElement('div');
    flag.classList.add('flag');
    let flag_icon = document.createElement('img');
    flag_icon.src = '../images/newsfeed_buttons/flag.png';
    flag_icon.classList.add('flag_icon');
    div.appendChild(flag_icon);

    // let time = document.createElement('div');
    // time.classList.add('time');
    // let clock = document.createElement('img');
    // clock.src = '../images/clock.png';
    // clock.classList.add('clock');
    // time.appendChild(clock);

    // let timeSince = document.createElement('p');
    // let timeSinceText = document.createTextNode(howLongAgo(new Date(body["Created Date"])));
    // timeSince.appendChild(timeSinceText);
    // time.appendChild(timeSince);

    // div.appendChild(time);

    let title = document.createElement('p');

    var concatedTitle = body.fixedText1 + " " + body.role + " " + body.fixedText2 + " " + body.org_name;
    let titleNode = document.createTextNode(concatedTitle);
    title.appendChild(titleNode);
    title.classList.add('milestone-title');
    div.appendChild(title);

    let description_div = document.createElement('div');

    let description = document.createElement('p');
    let descriptionNode = document.createTextNode(body.description);
    description.appendChild(descriptionNode);
    description.classList.add('milestone-description');
    description.classList.add('hidden-post');
    description.id = body.id;

    description_div.appendChild(description);

    // let readMore = document.createElement('BUTTON');
    // readMore.classList.add('readMore');
    // let readMoreNode = document.createTextNode('Read More');
    // readMore.appendChild(readMoreNode);
    // description_div.appendChild(readMore)

    // readMore.onclick = function (ev) {
    //     var target = ev.srcElement || ev.target;
    //     if (target.textContent == "Read More") {
    //         document.getElementById(body.id).classList.remove('hidden-post');
    //         target.textContent = "Read Less";
    //     } else {
    //         document.getElementById(body.id).classList.add('hidden-post');
    //         target.textContent = "Read More";
    //     }
    // }

    div.appendChild(description_div);

    document.getElementById('profile-postsbox').appendChild(div);
}

function createUserFeedArticles(body) {

    let div = document.createElement('div');
    div.classList.add('userfeed-post');

    let publisher_div = document.createElement('div');
    publisher_div.classList.add('publisher');

    let publisher_image = document.createElement('img');

    publisher_image.src = body.publisher_image;
    publisher_image.classList.add('userfeed-publisher-image');
    publisher_div.appendChild(publisher_image);

    let name = document.createElement('p');
    let nameNode = document.createTextNode(body.publisher_name)
    name.appendChild(nameNode);
    name.classList.add('userfeed-name');

    publisher_div.appendChild(name);

    div.appendChild(publisher_div);

    let image_div = document.createElement('div');
    let image = document.createElement('img');
    image.src = body.image;
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

    // if(body.favoriters){
    //     if (body.favoriters.some(fav => fav == user_id)) {
    //         fav_button.classList.add('favorite_click');
    //         liked = true;
    //         favs[body._id] = true;
    //     } else {
    //         fav_button.classList.add('button');
    //         liked = false;
    //         favs[body._id] = false;
    //     }
    // }


    let favorite_num = document.createElement('p');

    if (body.favoriters) {
        var fav_button_numNode = document.createTextNode(body.favoriters.length);
    } else {
        var fav_button_numNode = document.createTextNode(0);
    }
    favorite_num.appendChild(fav_button_numNode);
    favorite.appendChild(favorite_num);

    div.appendChild(favorite);
    // button_row.appendChild(favorite_num);

    let share = document.createElement('div');
    share.classList.add('share');
    let share_icon = document.createElement('img');
    share_icon.src = '../images/newsfeed_buttons/share.png';
    share_icon.classList.add('share_icon');
    div.appendChild(share_icon);

    let comment = document.createElement('div');
    comment.classList.add('comment');
    let comment_box = document.createElement('img');
    comment_box.src = '../images/newsfeed_buttons/comment.png';
    comment_box.classList.add('comment_box');
    div.appendChild(comment_box);

    let flag = document.createElement('div');
    flag.classList.add('flag');
    let flag_icon = document.createElement('img');
    flag_icon.src = '../images/newsfeed_buttons/flag.png';
    flag_icon.classList.add('flag_icon');
    div.appendChild(flag_icon);

    // let time = document.createElement('div');
    // time.classList.add('time');
    // let clock = document.createElement('img');
    // clock.src = '../images/clock.png';
    // clock.classList.add('clock');
    // time.appendChild(clock);

    // let timeSince = document.createElement('p');
    // let timeSinceText = document.createTextNode(howLongAgo(new Date(body["Created Date"])));
    // timeSince.appendChild(timeSinceText);
    // time.appendChild(timeSince);

    // div.appendChild(time);

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

    // let readMore = document.createElement('BUTTON');
    // readMore.classList.add('readMore');
    // let readMoreNode = document.createTextNode('Read More');
    // readMore.appendChild(readMoreNode);
    // description_div.appendChild(readMore)

    // readMore.onclick = function (ev) {
    //     var target = ev.srcElement || ev.target;
    //     if (target.textContent == "Read More") {
    //         document.getElementById(body.id).classList.remove('hidden-post');
    //         target.textContent = "Read Less";
    //     } else {
    //         document.getElementById(body.id).classList.add('hidden-post');
    //         target.textContent = "Read More";
    //     }
    // }

    div.appendChild(description_div);

    document.getElementById('profile-postsbox').appendChild(div);
}

function howLongAgo(date) {
    let now = new Date();
    let postDate = new Date(date);
    let years = DateDiff('yyyy', postDate, now);
    if (years >= 1) {
        if (years == 1) {
            return "1 year ago"
        }
        return years + " years ago"
    }

    let months = DateDiff('m', postDate, now);
    if (months >= 1) {
        if (months == 1) {
            return "1 month ago"
        }
        return months + " months ago"
    }

    let days = DateDiff('d', postDate, now);
    if (days >= 1) {
        if (days == 1) {
            return "1 day ago"
        }
        return days + " days ago"
    }
    let hours = DateDiff('h', postDate, now);
    if (hours >= 1) {
        if (hours == 1) {
            return "1 hour ago"
        }
        return hours + " hours ago"
    }
    return "Just now"
}

function loadProfile() {
    let div = document.getElementById('user_img');
    let pic = document.createElement('img');
    pic.classList.add('profile_pic');
    let source = localStorage.getItem('profile_image');

    pic.src = source;
    div.appendChild(pic);

    let namep = document.getElementsByClassName('navname')[0];
    let name = document.createTextNode(localStorage.getItem('first_name') + " " + localStorage.getItem('last_name'));
    namep.appendChild(name);
}

function showUsers(user, divId) {
    console.log(divId);
    let div = document.createElement('div');
    div.classList.add('follow');


    let image = document.createElement('img');
    if (user.profile_image == "http://app.bwayconnected.com/public/images/default.jpg") {
        image.src = "http://app.bwayconnected.com/public/images/T3uVwB96tW07.png"
    } else {
        image.src = user.profile_image;
    }
    image.classList.add('follow-image');
    div.appendChild(image)

    let name = document.createElement('p');
    let nameNode = document.createTextNode(user.first_name + " " + user.last_name);
    name.appendChild(nameNode);
    div.appendChild(name);

    document.getElementById(divId).appendChild(div);
    console.log(user.first_name);
}

function fillProfileEditor() {

    let firstnameEl = document.getElementById("input-first");
    if (!(localStorage.getItem("first_name") == null || localStorage.getItem("first_name") == "null")) {
        console.log("first name", localStorage.getItem("first_name"))
        firstnameEl.value = localStorage.getItem("first_name");
    }
    let lastnameEl = document.getElementById("input-last");
    if (!(localStorage.getItem("last_name") == null || localStorage.getItem("last_name") == "null")) {
        lastnameEl.value = localStorage.getItem("last_name");
    }
    let usernameEl = document.getElementById("input-handle");
    if (!(localStorage.getItem("handle") == null || localStorage.getItem("handle") == "null")) {
        usernameEl.value = localStorage.getItem("handle");
    }
    let phoneEl = document.getElementById("input-phone");
    if (!(localStorage.getItem("phone") == undefined || localStorage.getItem("phone") == 0)) {
        phoneEl.value = localStorage.getItem("phone");
    }
    let cityEl = document.getElementById("input-city")
    if (!(localStorage.getItem("city") == null || localStorage.getItem("city") == "null")) {
        console.log("loading city ", localStorage.getItem("city"))
        cityEl.value = localStorage.getItem("city");
    }
    let countryEl = document.getElementById("input-country")
    if (!(localStorage.getItem("country") == null || localStorage.getItem("country") == "null")) {
        countryEl.value = localStorage.getItem("country");
    }
    let handleEl = document.getElementById("input-headline")
    if (!(localStorage.getItem("headline") == null || localStorage.getItem("headline") == "null")) {
        handleEl.value = localStorage.getItem("headline");
    }
    let jobEl = document.getElementById("input-job-title")
    if (!(localStorage.getItem("job_title") == null || localStorage.getItem("job_title") == "null")) {
        jobEl.value = localStorage.getItem("job_title");
    }
    let companyEl = document.getElementById("input-company")
    if (!(localStorage.getItem("job_company") == null || localStorage.getItem("job_company") == "null")) {
        companyEl.value = localStorage.getItem("job_company");
    }
    let prev_jobEl = document.getElementById("input-previous")
    if (!(localStorage.getItem("prev_job") == null || localStorage.getItem("prev_job") == "null")) {
        prev_jobEl.value = localStorage.getItem("prev_job");
    }
    let prev_job_companyEl = document.getElementById("input-previous-company")
    if (!(localStorage.getItem("prev_company") == null || localStorage.getItem("prev_company") == "null")) {
        prev_job_companyEl.value = localStorage.getItem("prev_company");
    }
}

function updateUser() {

    let first_name = document.getElementById('input-first').value;
    let last_name = document.getElementById('input-last').value;
    let phone = document.getElementById('input-phone').value;
    let handle = document.getElementById('input-handle').value;
    let city = document.getElementById('input-city').value;
    let country = document.getElementById('input-country').value;
    let headline = document.getElementById('input-headline').value;
    let job_title = document.getElementById('input-job-title').value;
    let job_company = document.getElementById('input-company').value;
    let prev_job = document.getElementById('input-previous').value;
    let prev_company = document.getElementById('input-previous-company').value;

    // let url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/user_update";
    let url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/user_update";

    console.log(phone)
    if (phone == "") {
        phone = 0
    }

    let body = {
        'user_id': user_id,
        'phone': phone,
        'first_name': first_name,
        'last_name': last_name,
        'handle': handle,
        'city': city,
        'country': country,
        'headline': headline,
        'job_title': job_title,
        'job_company': job_company,
        'prev_job': prev_job,
        'prev_company': prev_company
    }
    let params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        method: 'POST',
        body: JSON.stringify(body)
    }

    fetch(url, params)
        .then(res => res.json())
        .then(body => {
            console.log(body)
            if (body.response.message == "Username must be unique") {
                createCustomAlert("Username is not unique.")
                console.log("username is bad!!!!")
            } else {
                localStorage.setItem("handle", body.response.user.handle);
                localStorage.setItem("first_name", body.response.user.firstname);
                localStorage.setItem("last_name", body.response.user.lastname);
                localStorage.setItem("city", body.response.user.city);
                localStorage.setItem("country", body.response.user.country);
                localStorage.setItem("phone", body.response.user.phone);
            }
        })
}

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Ankita

function showFollowingCurrentUserProfile(followingArray, x) {
    if (x == "following") {
        document.getElementById('profile-following').innerHTML = "";

    } else if (x == "followers") {
        document.getElementById('profile-followers').innerHTML = "";
    }

    if (followingArray.length > 0) {

        followingArray.forEach(element => {
            // console.log(element.firstname, element.lastname ,element.image);

            if (element.company !== undefined) {

                console.log('companyyyyyyyyyyyyyyyyyyyyy');


                let divFollowing = document.createElement('div');
                divFollowing.className = "following";
                // divFollowing.setAttribute("id", element._id);

                // adding onclick event
                divFollowing.onclick = (function () {
                    var unique_id = element._id;
                    return function () {
                        window.location.href = "../CompanyProfiles/add_company_profiles.html?id=" + unique_id;
                    }
                })();
                // adding onclick event

                let fullname = document.createElement('p');
                fullname.className = "following-name";

                var imageSrc_cc = "";
                var fullName_cc = "";
                var handle_cc = "";

                // get_company_info_here


                var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/company_read";

                var data = {
                    "usertype_id": element.company
                };
            
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => {
                        console.log('company response here----------',response);
                        if (response.status == "success") {
            
                        imageSrc_cc = response.response.user.image;
                        fullName_cc = response.response.company.name;
                        handle_cc = response.response.user.handle;



                            fullname_text = document.createTextNode(fullName_cc);
                            fullname.appendChild(fullname_text);
                            // divFollowing.appendChild(fullname);
            
                            let handle = document.createElement('p');
                            handle.className = "following-handle";
                            hande_text = document.createTextNode("@" + handle_cc);
                            handle.appendChild(hande_text);
                            // divFollowing.appendChild(handle);
            
            
                            let profileText = document.createElement('div');
                            profileText.className = "following-text";
                            profileText.appendChild(fullname);
                            profileText.appendChild(handle);
                            divFollowing.appendChild(profileText);
            
            
            
                            var userImageAddress = "";
                            let user_image = document.createElement('img');
                            user_image.className = "following-img";
                            if (imageSrc_cc) {
                                if (element.image.substr(0, 4) == "data") {
                                    userImageAddress = imageSrc_cc;
                                } else {
                                    userImageAddress = "https:" + imageSrc_cc;
                                }
                                user_image.src = userImageAddress;
                            }
            
                            let profileImage = document.createElement('div');
                            profileImage.className = "following-img-wrap";
                            profileImage.appendChild(user_image);
                            divFollowing.appendChild(profileImage);
            
            
                            if (x == "following") {
                                document.getElementById('profile-following').appendChild(divFollowing);
                            } else if (x == "followers") {
                                document.getElementById('profile-followers').appendChild(divFollowing);
                            }
            
                        }
                    })

            } else {

                let divFollowing = document.createElement('div');
                divFollowing.className = "following";
                // divFollowing.setAttribute("id", element._id);

                // adding onclick event
                divFollowing.onclick = (function () {
                    var unique_id = element._id;
                    return function () {
                        window.location.href = "../User-Profile/user_profile.html?id=" + unique_id;
                    }
                })();
                // adding onclick event

                let fullname = document.createElement('p');
                fullname.className = "following-name";

                fullname_text = document.createTextNode(element.firstname + " " + element.lastname);
                fullname.appendChild(fullname_text);
                // divFollowing.appendChild(fullname);

                let handle = document.createElement('p');
                handle.className = "following-handle";
                hande_text = document.createTextNode("@" + element.handle);
                handle.appendChild(hande_text);
                // divFollowing.appendChild(handle);


                let profileText = document.createElement('div');
                profileText.className = "following-text";
                profileText.appendChild(fullname);
                profileText.appendChild(handle);
                divFollowing.appendChild(profileText);



                var userImageAddress = "";
                let user_image = document.createElement('img');
                user_image.className = "following-img";
                if (element.image) {
                    if (element.image.substr(0, 4) == "data") {
                        userImageAddress = element.image;
                    } else {
                        userImageAddress = "https:" + element.image;
                    }
                    user_image.src = userImageAddress;
                }

                let profileImage = document.createElement('div');
                profileImage.className = "following-img-wrap";
                profileImage.appendChild(user_image);
                divFollowing.appendChild(profileImage);


                if (x == "following") {
                    document.getElementById('profile-following').appendChild(divFollowing);
                } else if (x == "followers") {
                    document.getElementById('profile-followers').appendChild(divFollowing);
                }

            }



        });

    } else {


        if (x == "following") {
            document.getElementById('profile-following').innerHTML = "No Following";

        } else if (x == "followers") {
            document.getElementById('profile-followers').innerHTML = "No Followers";
        }
    }

}

function loadAndShowFollowingFollowerNumbers() {
    // document.getElementById('user-followers-num').innerHTML = "No Followers";
    // document.getElementById('user-following-num').innerHTML = "No Followers";

    // get following number

    token = localStorage.getItem("token");
    user_id = localStorage.getItem("user_id");

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_following";

    var data = {
        "user_id": user_id
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log(response);
            if (response.status == "success") {

                console.log(response.response.following.length);
                document.getElementById('user-following-num').innerHTML = response.response.following.length;

            }
        })

    // get followers number

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_followers";

    var data = {
        "user_id": user_id
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log(response);
            if (response.status == "success") {

                console.log(response.response.followers.length);
                document.getElementById('user-followers-num').innerHTML = response.response.followers.length;

            }
        })



}








