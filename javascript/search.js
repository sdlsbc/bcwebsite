function redirectToResultsPage(query_string) {
    window.location.href = "../SearchResults/searchResults.html?query="+query_string;

}
function getSearchResults(query_string) {
    document.getElementById('searchResultsDisplay').innerHTML = "";
    // var query_string = document.getElementById('search_query').value;
    console.log('query_string ', query_string);
    //var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/search_functionality';
    var url = "https://broadwayconnected.bubbleapps.io"+version_change+"api/1.1/wf/search_functionality";
    var token = localStorage.getItem("token");

    var data = {
        "query": query_string
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
                // console.log();

                if (response.response.users.length > 0) {
                    var allUsersFoundList = response.response.users;
                    displayUsersFound(allUsersFoundList);
                }
                if (response.response.posts.length > 0) {
                    var allPostsFoundList = response.response.posts;
                    displayPostsFound(allPostsFoundList);
                }
                
                console.log(response.response.posts.length);
                // console.log(response.response.users.length);

            }
        })
    // .then(error => {
    //     console.log('error bad request', error);
    // })
}

function displayUsersFound(array1) {

    array1.forEach(function (element) {
        console.log('user 1', element._id);
        // console.log('user 1 image', element.image);

        let divUsers = document.createElement('div');
        divUsers.setAttribute("id", element._id);

        // adding onclick event
        divUsers.onclick = (function () {
            var unique_id = element._id;
            return function () {
                window.location.href = "../User-Profile/user_profile.html?id="+unique_id;
            }
        })();
         // adding onclick event
        
        let profileHeader = document.createElement('h3');
        profileHeader.className = "profile-h3-header";
        divUsers.appendChild(profileHeader);

        divUsers.className = "profile-div";
        let fullname = document.createElement('p');
        fullname.className = "profile-full-name";
        fullname_text = document.createTextNode(element.firstname + " " + element.lastname);
        fullname.appendChild(fullname_text);
        // divUsers.appendChild(fullname);

        let handle = document.createElement('p');
        handle.className = "profile-handle";
        hande_text = document.createTextNode("@"+element.handle);
        handle.appendChild(hande_text);
        // divUsers.appendChild(handle);

        let profileText = document.createElement('div');
        profileText.className = "profile-text";
        profileText.appendChild(fullname);
        profileText.appendChild(handle);
        divUsers.appendChild(profileText);


        var userImageAddress = "";
        let user_image = document.createElement('img');
        user_image.className = "image";
        if (element.image){
            if(element.image.substr(0,4) == "data"){
                userImageAddress = element.image;
            } else {
                userImageAddress = "https:"+ element.image;
            }
            user_image.src = userImageAddress;
        }

        let profileImage = document.createElement('div');
        profileImage.className = "profile-image";
        profileImage.appendChild(user_image);
        divUsers.appendChild(profileImage);

        let profileFollowLine = document.createElement('p');
        profileFollowLine.className = "profile-follow-line";

        let profileFollow = document.createElement('button');
        profileFollow.className = "profile-follow-btn";



        let profileContent = document.createElement('div');
        profileContent.className = "profile-all-content";
        profileContent.appendChild(profileImage);
        profileContent.appendChild(profileText);
        profileContent.appendChild(profileFollowLine);
        profileContent.appendChild(profileFollow);
        divUsers.appendChild(profileContent);


        // divUsers.appendChild(user_image);




        document.getElementById('searchResultsDisplay').appendChild(divUsers);
    });

}

function displayPostsFound(array2) {
console.log('array2',array2)
    array2.forEach(function (element) {
        console.log('post ', element);
        console.log('post image', element.image);

        let divPosts = document.createElement('div');
        divPosts.setAttribute("id", element._id);

        // adding onclick event
        divPosts.onclick = (function () {
            var unique_id = element._id;
            return function () {
                window.location.href = "../User-Profile/user_profile.html?id="+unique_id;
            }
        })();
         // adding onclick event

        let postHeader = document.createElement('h3');
        postHeader.className = "post-h3-header";
        divPosts.appendChild(postHeader);


        divPosts.className = "posts-div";
        let title = document.createElement('p');
        title.className = "post-title";
        title_text = document.createTextNode(element.title);
        title.appendChild(title_text);
        // divPosts.appendChild(title);

        let heading = document.createElement('p');
        heading.className = "post-heading";
        heading_text = document.createTextNode(element.heading);
        heading.appendChild(heading_text);
        // divPosts.appendChild(heading);

        let postText = document.createElement('div');
        postText.className = "post-text";
        postText.appendChild(title);
        postText.appendChild(heading);
        divPosts.appendChild(postText);


        var postImageAddress = "";
        let post_image = document.createElement('img');
        post_image.className = "image";
        if (element.image){
            if(element.image.substr(0,4) == "data"){
                postImageAddress = element.image;
            } else {
                postImageAddress = "https:"+ element.image;
            }
            post_image.src = postImageAddress;
        }
        

        let postImage = document.createElement('div');
        postImage.className = "post-image";
        postImage.appendChild(post_image);
        divPosts.appendChild(postImage);

        let postFollowLine = document.createElement('p');
        postFollowLine.className = "post-follow-line";

        let postFollow = document.createElement('button');
        postFollow.className = "post-follow-btn";


        let postContent = document.createElement('div');
        postContent.className = "post-all-content";
        postContent.appendChild(postImage);
        postContent.appendChild(postText);
        postContent.appendChild(postFollowLine);
        postContent.appendChild(postFollow);
        divPosts.appendChild(postContent);


        // divPosts.appendChild(post_image);
        document.getElementById('searchResultsDisplay').appendChild(divPosts);
    });

}
