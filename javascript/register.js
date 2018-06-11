function register() { 
    var email=document.getElementById('signup-email').value;
    var password=document.getElementById('signup-password').value;
    var fname=document.getElementById('signup-firstname').value;
    var lname=document.getElementById('signup-lastname').value;

    var url = 'http://app.bwayconnected.com/api/register';
    var data = {
        "email": email,
        "password": password,
        "first_name": fname,
        "last_name": lname
    };

    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response =>{

        // check if sign up successful
        if(response.Response == "1000") {
            alert("User Already Exists");
        } else {
            console.log('Success:', response)
            var id = response.Result.user_id;
            var first_name = response.Result.first_name;
            var last_name = response.Result.last_name;
            var profile_image = response.Result.profile_image;
            var token = response.Result.token;

            localStorage.setItem("user_id", id);
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);
            localStorage.setItem("profile_image", profile_image);
            localStorage.setItem("token", token);
            console.log(localStorage.getItem("user_id"));
            if (localStorage.getItem("user_id") == "") {
                alert("not saved locally");
            } else {
                console.log("redirected")
                window.location.href = "Newsfeed/newsfeed.html";
            }
        }
    })
}

function signin(){
    
    var email=document.getElementById('signin-email').value;
    var password=document.getElementById('signin-password').value;

    // verify email
    var url = 'http://app.bwayconnected.com/api/login';
var data = {
    "email": email,
    "password": password
  };

  fetch(url, {
  method: 'POST', 
  body: JSON.stringify(data), 
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response =>{

    console.log('Success:', response);

    // check if sign in successful
    if(response.Response == "1000")
    {
        alert("Invalid Credentials");
    }else{

        console.log('Success:', response);
        var id = response.Result.user_id;
        var first_name = response.Result.first_name;
        var last_name = response.Result.last_name;
        var profile_image = response.Result.profile_image;
        var token = response.Result.token;

        localStorage.setItem("user_id", id);
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("profile_image", profile_image);
        localStorage.setItem("token", token);

        if (localStorage.getItem("user_id") == "")
        {
            alert("not saved locally");
        }else{
            //alert(localStorage.getItem("user_id"));
            window.location.href = "Newsfeed/newsfeed.html";
        }
    }
})


}

function signout(){
    localStorage.clear();
    alert("Logged out");
    window.location.href = "../index.html";
}