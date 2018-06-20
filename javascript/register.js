function register() {
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    var fname = document.getElementById('signup-firstname').value;
    var lname = document.getElementById('signup-lastname').value;
    var handle = document.getElementById('signup-handle').value;

    var url = 'http://app.bwayconnected.com/api/register';
    var data = {
        "email": email,
        "password": password,
        "first_name": fname,
        "last_name": lname,
        "handle": handle
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

            // check if sign up successful
            if (response.Response == "1000") {
                createCustomAlert("WARNING: User Already Exists");
            } else {
                console.log('Success:', response)
                var id = response.Result.user_id;
                var first_name = response.Result.first_name;
                var last_name = response.Result.last_name;
                var profile_image = response.Result.profile_image;
                var token = response.Result.token;
                var handle = response.Result.handle;

                localStorage.setItem("user_id", id);
                localStorage.setItem("first_name", first_name);
                localStorage.setItem("last_name", last_name);
                localStorage.setItem("profile_image", profile_image);
                localStorage.setItem("token", token);
                localStorage.setItem("handle", handle);
                console.log(localStorage.getItem("user_id"));
                if (localStorage.getItem("user_id") == "") {
                    createCustomAlert("WARNING: Not saved locally");
                } else {
                    console.log("redirected")
                    window.location.href = "Newsfeed/newsfeed.html";
                }
            }
        })
}

function signin() {

    var email = document.getElementById('signin-email').value;
    var password = document.getElementById('signin-password').value;

    var error_message = validateSigninInput(email, password);
    if (error_message !== "") {
        console.log(error_message);
        createCustomAlert(error_message);
    } else {


        // verify log in
        var url = 'http://app.bwayconnected.com/api/login';
        var data = {
            "email": email,
            "password": password
        };

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {

                console.log('Success:', response);

                // check if sign in successful
                if (response.Response == "1000") {
                    createCustomAlert("WARNING: Invalid Credentials");
                } else {

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

                    if (localStorage.getItem("user_id") == "") {
                        createCustomAlert("WARNING: Not saved locally");
                    } else {
                        //alert(localStorage.getItem("user_id"));
                        window.location.href = "Newsfeed/newsfeed.html";
                    }
                }
            })
    }

}

function signout() {
    localStorage.clear();
    createCustomAlert("WARNING: Logged out");
    window.location.href = "../index.html";
}







// var ALERT_TITLE = "Oops!";
var ALERT_BUTTON_TEXT = "x";

if (document.getElementById) {
    window.alert = function (txt) {
        createCustomAlert(txt);
    }
}


function createCustomAlert(txt) {
    d = document;

    if (d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if (d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px";
    alertObj.style.visiblity = "visible";

    // h1 = alertObj.appendChild(d.createElement("h1"));
    // h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function () { removeCustomAlert(); return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}
function ful() {
    alert('Alert this pages');
}

function validateSigninInput(e, p) {
    if (e == "" || e == null) {
        return 'Please Enter Email';
    } else if (p == "" || p == null) {
        return 'Please Enter Password';
    } else if (validateEmail(e)) {
        return '';
    }else {
        return 'Please Enter A Valid Email ID';
    }
}

function validateEmail(e) {
    var atpos = e.indexOf("@");
    var dotpos = e.lastIndexOf(".");
    console.log('In validate email inside',e);
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= e.length) {
        console.log('In validate email false');
        return false;
    }else {
        return true;
    }
}