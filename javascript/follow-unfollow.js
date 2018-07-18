function checkFollowStatus() {
    var fstatus = document.getElementById('user_profile_follow_button').innerHTML;

    switch (fstatus) {
        case 'Unfollow':
            unfollowThisProfile();
            break;
        case 'Follow':
            followThisProfile();
            break;
    }
}

function followThisProfile() {
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
                document.getElementById('user_profile_follow_button').innerHTML = "Unfollow"

            }
        })
}

function unfollowThisProfile() {
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
                document.getElementById('user_profile_follow_button').innerHTML = "Follow"

            }
        })
}