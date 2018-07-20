// ..\javascript\user-company-profile.js




function fetchCompanyProfileData() {

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
                console.log('response response company data', response.response);

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


                var imageSrc = response.response.user.image;
                var fullName = response.response.company.name;
                var handle = response.response.user.handle;
                
                document.getElementById('company_image_here').src = profile_image;
                document.getElementById('company_name').innerHTML = fullName;
                document.getElementById('xyz_company_handle').innerHTML = "@" + handle;

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
                        document.getElementById('company_profile_follow_button').innerHTML = "Unfollow";
                    }
                });
            }
        })

}
