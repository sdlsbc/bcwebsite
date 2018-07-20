function checkFollowStatus(page) {
    var fstatus = "";
    if (page == "company") {
        fstatus = document.getElementById('company_profile_follow_button').innerHTML;

    } else if (page == "xyz") {
        fstatus = document.getElementById('user_profile_follow_button').innerHTML;

    }

    switch (fstatus) {
        case 'Unfollow':
            unfollowThisProfile(page);
            break;
        case 'Follow':
            followThisProfile(page);
            break;
    }
}

function followThisProfile(page) {
    // fetch url id
    console.log('In follow profile');

    var urlParam = function (name, w) {
        w = w || window;
        var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
            val = w.location.search.match(rx);
        return !val ? '' : val[1];
    }
    var unique_id = urlParam('id');

    // get the token for authorization
    token = localStorage.getItem("token");
    // api call

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/follow";

    var data = {
        "user_id": unique_id
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
            console.log('follow function resposne',response);
            if (response.status == "success") {
                console.log('following');
                if (page == "company") {
                    document.getElementById('company_profile_follow_button').innerHTML = "Unfollow";
                    
                } else if (page == "xyz") {
                    document.getElementById('user_profile_follow_button').innerHTML = "Unfollow";
            
                }

            }
        })
}

function unfollowThisProfile(page) {
    // fetch url id
    console.log('In unfollow profile');
    var urlParam = function (name, w) {
        w = w || window;
        var rx = new RegExp('[\&|\?]' + name + '=([^\&\#]+)'),
            val = w.location.search.match(rx);
        return !val ? '' : val[1];
    }
    var unique_id = urlParam('id');

    // get the token for authorization
    token = localStorage.getItem("token");
    // api call

    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/unfollow";

    var data = {
        "user_id": unique_id
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
            console.log('unfollow function resposne',response);
            if (response.status == "success") {
                console.log('unfollowed');
                if (page == "company") {
                    document.getElementById('company_profile_follow_button').innerHTML = "Follow";
                    
                } else if (page == "xyz") {
                    document.getElementById('user_profile_follow_button').innerHTML = "Follow";
            
                }

            }
        })
}