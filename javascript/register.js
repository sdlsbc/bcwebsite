function register() {
    console.log('in register: step1');
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    var fname = document.getElementById('signup-firstname').value;
    var lname = document.getElementById('signup-lastname').value;
    var handle = document.getElementById('signup-handle').value;
    var city = document.getElementById('signup-city').value;
    var country = document.getElementById('signup-country').value;
    var userType = document.getElementById("signup-usertype").value;
    var phone = document.getElementById("signup-phone").value;
    var c_name = "";
    var p_name = ""
    var dob = "";
    let error_message = validateSignUpInput(email, password, fname, lname, handle, userType, city, country);
    if (error_message !== "") {
        console.log('error msg from function', error_message);
        createCustomAlert(error_message);
    } else {
        console.log('in register: step2');

        switch (userType) {
            case "company":
                c_name = document.getElementById('signup-companyName').value;
                break;
            case "production":
                p_name = document.getElementById('signup-productionName').value;
                break;
            case "personal":
                dob = document.getElementById('signup-companyname').value;
                break;
        }

        var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/user_create';
        var data = {
            "handle": handle,
            "email": email,
            "password": password,
            "firstname": fname,
            "lastname": lname,
            "phone": phone,
            "city": city,
            "country": country,
            "usertype": userType,
            "company_name": c_name,
            "date_of_birth": dob,
            "production_name": p_name,
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

                if (response.status == "success") {
                    createCustomAlert("you are logged in");
                    console.log('Success:', response);
                    var token = response.response.token;
                    var res_user_id = response.response.user_id;
                    var res_handle = response.response.user.handle;
                    var res_usertype_id = response.response.personal._id;
                    var res_usertype = response.response.user.usertype;


                    localStorage.setItem("user_id", res_user_id);
                    localStorage.setItem("usertype_id", res_usertype_id);
                    localStorage.setItem("usertype", res_usertype);
                    localStorage.setItem("token", token);
                    localStorage.setItem("handle", res_handle);

                    // save usertype data 
                    saveUserTypeData(token);

                    console.log('token in local storage', localStorage.getItem("token"));
                    if (localStorage.getItem("token") == "") {
                        createCustomAlert("WARNING: Not saved locally");
                    } else {
                        console.log("redirected to newsfeed")
                        // window.location.href = "Newsfeed/newsfeed.html";
                    }

                } else {
                    createCustomAlert("WARNING: User Not Signed Up");
                }
            })
    }
}

function saveUserTypeData(token) {
    console.log('in save user type data');
    var user_id = localStorage.getItem("user_id");
    var usertype = localStorage.getItem("usertype");
    var authorization_key = "Bearer " + token;

    console.log(authorization_key);

    var data = "";
    if (usertype == 'company') {
        var c_type = document.getElementById('company-type').value;
        var c_link = document.getElementById('company-link').value;
        var c_description = document.getElementById('company-desc').value;

        console.log('company type ',c_type);
        data = {
            "user_id": user_id,
            "type": c_type,
            "link": c_link,
            "description": c_description
        };
    }
    var url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/company_update";

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization_key
        }
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
 
            if (response.status == "success") {
                console.log('', response);
            }
        }) 

}

function signin() {

    var email = document.getElementById('signin-email').value;
    var password = document.getElementById('signin-password').value;

    var error_message = validateSigninInput(email, password);

    var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/login';
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

            if (response.status == "success") {
                createCustomAlert("you are logged in");
                var token = response.response.token;
                var user_id = response.response.user_id;
                var handle = response.response.user.handle;
                var res_usertype = response.response.user.usertype;
                console.log(res_usertype);
                var res_usertype_id = "";
                if (res_usertype == "company") {
                    res_usertype_id = response.response.user.company;
                    console.log('usertype id in register.js', res_usertype_id);
                }
                if (res_usertype == "production") {
                    res_usertype_id = response.response.user.production;
                    console.log('usertype id in register.js', res_usertype_id);
                }
                if (res_usertype == "personal") {
                    res_usertype_id = response.response.user.personal;
                    console.log('usertype id in register.js', res_usertype_id);
                }

                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("handle", handle);
                localStorage.setItem("usertype", res_usertype);
                localStorage.setItem("usertype_id", res_usertype_id);
                console.log('usertype_id is: ', res_usertype_id);
                if (localStorage.getItem("token") == "") {
                    createCustomAlert("WARNING: Not saved locally");
                } else {
                    window.location.href = "Newsfeed/newsfeed.html";
                }
            }
        })
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
    } else {
        return 'Please Enter A Valid Email ID';
    }
}

function validateSignUpInput(e, p, fn, ln, h, ut, city, country) {
    if (e == "" || e == null) {
        return 'Please Enter Email';
    } else if (p == "" || p == null) {
        return 'Please Enter Password';
    } else if (p.length < 6) {
        return 'The Password Must Be At Least 6 Characters';
    } else if (fn == "" || fn == null) {
        return 'Please Enter First Name';
    } else if (ln == "" || ln == null) {
        return 'Please Enter Last Name';
    } else if (h == "" || h == null) {
        return 'Please Enter Handle';
    } else if (ut == "" || ut == null) {
        return 'Please Enter User Type';
    } else if (city == "" || city == null) {
        return 'Please Enter City';
    } else if (country == "" || country == null) {
        return 'Please Enter Country';
    } else {
        return '';
    }
}

function validateEmail(e) {
    var atpos = e.indexOf("@");
    var dotpos = e.lastIndexOf(".");
    console.log('In validate email inside', e);
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= e.length) {
        console.log('In validate email false');
        return false;
    } else {
        return true;
    }
}