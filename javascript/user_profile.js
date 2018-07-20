// globals

var divs = ["profile-postsbox", "profile-calendar", "profile-followers", "profile-following"];

var visibleDivId = null;
var followers = false;
var followings = false;

var urlParam = function (name, w) {
    w = w || window;
    var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
        val = w.location.search.match(rx);
    return !val ? '' : val[1];
}

var xyz_user_id = urlParam('id'); //fetch from url

function fetchProfileData() {

    // fetch url id
    var urlParam = function (name, w) {
        w = w || window;
        var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
            val = w.location.search.match(rx);
        return !val ? '' : val[1];
    }
    
    var unique_id = urlParam('id');
    console.log(unique_id);

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/user_read";

    var data = {
        "user_id": unique_id
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
            console.log(response);
            if (response.status == "success") {
                console.log('response response', response.response);

                //check if current user is already following this user
                checkIfFollowing(unique_id);
                var imageSrc = response.response.user.image;
                var profile_image = "";
                // start filling the page
                if (!(imageSrc == null || imageSrc == "")) {
                    if (imageSrc.substr(0, 4) == "data" || imageSrc.substr(0, 4) == "http") {
                        profile_image = imageSrc;
                    } else {
                        profile_image = "https:" + imageSrc;
                    }
                }


                // var imageSrc = response.response.user.image;
                var fullName = response.response.user.firstname + " " + response.response.user.lastname;
                var handle = response.response.user.handle;
                var headline = response.response.personal.headline;
                var job_company = response.response.personal.job_company;
                var job_title = response.response.personal.job_title;
                var prev_company = response.response.personal.prev_company;
                var prev_job = response.response.personal.prev_job;
                var city = response.response.user.city;
                var country = response.response.user.country;

                document.getElementById('user_image_here').src = profile_image;
                document.getElementById('user_full_name').innerHTML = fullName;
                document.getElementById('user_handle').innerHTML = "@" + handle;
                document.getElementById('user_headline').innerHTML = headline;
                document.getElementById('user_job_company').innerHTML = job_company;
                document.getElementById('user_job_title').innerHTML = job_title;
                document.getElementById('user_prev_info').innerHTML = prev_job + "@" + prev_company;
                document.getElementById('user_city').innerHTML = city;
                document.getElementById('user_country').innerHTML = country;

            }
        })
}

function checkIfFollowing(unique_id) {
    token = localStorage.getItem("token");
    user_id = localStorage.getItem("user_id");

    var url = "https://broadwayconnected.bubbleapps.io"+version_change+"api/1.1/wf/get_following";

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
                
                console.log('get list of following',response.response.following);

                // check if unique id of xyz is in following of current user

                response.response.following.forEach(element => {
                    console.log(element);
                    if (element == unique_id) {
                        console.log('following');
                        document.getElementById('user_profile_follow_button').innerHTML = "Unfollow";
                    }
                });
            }
        })

}


// showing followers and following functions

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

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_xyz_follower";

    var data = {
        "xyz_user_id" : xyz_user_id
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
                showFollowingCurrentUserProfile(response.response.follower, "follower");
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

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_xyz_following";

    var data = {
        "xyz_user_id" : xyz_user_id
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

function showFollowingCurrentUserProfile(followingArray, x) {
    if (x == "following") {
        document.getElementById('profile-following').innerHTML = "";

    } else if (x == "follower") {
        document.getElementById('profile-followers').innerHTML = "";
    }

    if (followingArray.length > 0) {

        followingArray.forEach(element => {
            // console.log(element.firstname, element.lastname ,element.image);

            let divFollowing = document.createElement('div');
            divFollowing.className = "following";
            // divFollowing.setAttribute("id", element._id);

            // adding onclick event
            divFollowing.onclick = (function () {
                var unique_id = element._id;
                return function () {
                    if (checkIfTheUserClickedIsCurrentUser(unique_id)) {
                        window.location.href = "../Profile/profile.html";
                    } else {
                        window.location.href = "../User-Profile/user_profile.html?id=" + unique_id;
                    }
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
            } else if (x == "follower") {
                document.getElementById('profile-followers').appendChild(divFollowing);
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

// checkIfTheUserClickedIsCurrentUser if yes redirect to MyProfilePage

function checkIfTheUserClickedIsCurrentUser(unique_id) {
    user_id = localStorage.getItem("user_id");
    if (unique_id == user_id) {
        return true;
    } else {
        return false;
    }
}


// populating xyz user's userfeed onload 

function load_xyz_UserData() {
    document.getElementById('profile-postsbox').innerHTML = "";

    get_userfeed();
}

function get_userfeed() {

    console.log(' in get xyz userfeed');
    var token = localStorage.getItem("token");


    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_userfeed";

    let body = {
        "xyz_user_id": xyz_user_id
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

                var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/get_unique_id_item_xyz";

                let body = {
                    "UI": element,
                    "xyz_user_id": xyz_user_id
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
                        console.log('fetching each userfeed element in xyz feed : ', body.response);
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

// create A Milestone on Userfeed

function createElementForUserfeed_Milestones(body) {
    console.log('creating a milestone');

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

    var concatedTitle = body.fixedText1 + " " + body.role + " " + body.fixedText2 + " " + body.org_name;
    let titleNode = document.createTextNode(concatedTitle);
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