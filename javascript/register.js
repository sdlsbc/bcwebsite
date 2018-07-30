var upload_image_base64 = "";

function register() {
    console.log('in register: step1');
    var userType = document.getElementById("signup-usertype").value;

    if (userType == "company") {
        document.getElementById("btnSignUpCompany").disabled = true;
        document.getElementById("btnSignUpCompany").classList.add('btnDisabled');
        document.getElementById("body").style.cursor = "wait";

        var email = document.getElementById('signup-company-email').value;
        var password = document.getElementById('signup-company-password').value;
        var fname = document.getElementById('signup-company-firstname').value;
        var lname = document.getElementById('signup-company-lastname').value;
        var handle = document.getElementById('signup-companyHandle').value;
        // var city = document.getElementById('signup-company-city').value;
        // var country = document.getElementById('signup-company-country').value;
        // var phone = document.getElementById("signup-company-phone").value;

    } else if (userType == "production" || userType == "personal") {

        document.getElementById("btnProductionSubmit").disabled = true;
        document.getElementById("btnProductionSubmit").classList.add('btnDisabled');

        document.getElementById("btnSignupPersonal").disabled = true;
        document.getElementById("btnSignupPersonal").classList.add('btnDisabled');

        document.getElementById("body").style.cursor = "wait";

        var email = document.getElementById('signup-email').value;
        var password = document.getElementById('signup-password').value;
        var fname = document.getElementById('signup-firstname').value;
        var lname = document.getElementById('signup-lastname').value;
        var handle = document.getElementById('signup-handle').value;
        //var city = document.getElementById('signup-city').value;
        //var country = document.getElementById('signup-country').value;
        //var phone = document.getElementById("signup-phone").value;

    }
    var c_name = "";
    var p_name = ""
    var dob = "";
    let error_message = validateSignUpInput(email, password, fname, lname, handle, userType);
    if (error_message !== "") {
        console.log('error msg from function', error_message);
        createCustomAlert(error_message);
    } else {

        switch (userType) {
            case "company":
                c_name = document.getElementById('signup-companyName').value;
                console.log('c_name', c_name);
                break;
            case "production":
                p_name = document.getElementById('signup-productionName').value;
                break;
            case "personal":
                dob = document.getElementById('personal-dateOfBirth').value;
                break;
        }

        // var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/user_create';
        var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/user_create";

        var data = {
            "handle": handle,
            "email": email,
            "password": password,
            "firstname": fname,
            "lastname": lname,
            "usertype": userType,
            "company_name": c_name,
            "date_of_birth": dob,
            "production_name": p_name,
            "contents": upload_image_base64
        };

        console.log('data : ', data)
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

                    console.log('Success:', response);

                    document.getElementById("btnProductionSubmit").disabled = false;
                    document.getElementById("btnProductionSubmit").classList.remove('btnDisabled');

                    document.getElementById("btnSignupPersonal").disabled = false;
                    document.getElementById("btnSignupPersonal").classList.remove('btnDisabled');

                    document.getElementById("body").style.cursor = "pointer";

                    if (response.response.message == "Username not unique") {
                        createCustomAlert("Username not Unique, Try again");
                    } else {
                        createCustomAlert("you are logged in");

                        var token = response.response.token;
                        var res_user_id = response.response.user_id;
                        var res_handle = response.response.user.handle;
                        var res_profileimage = response.response.user.image;
                        var res_usertype_id = response.response.personal._id;
                        var res_usertype = response.response.user.usertype;
                        var res_lastname = response.response.user.lastname;
                        var res_firstname = response.response.user.firstname;
                        var city = response.response.user.city;
                        var country = response.response.user.country;

                        localStorage.setItem("user_id", res_user_id);
                        localStorage.setItem("usertype_id", res_usertype_id);
                        localStorage.setItem("usertype", res_usertype);
                        localStorage.setItem("token", token);
                        localStorage.setItem("handle", res_handle);
                        localStorage.setItem("first_name", res_firstname);
                        localStorage.setItem("last_name", res_lastname);
                        localStorage.setItem("profile_image", res_profileimage);
                        localStorage.setItem("city", city);
                        localStorage.setItem("country", country);


                        // save usertype data 
                        saveUserTypeData(token);
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

        console.log('company type ', c_type);
        data = {
            "user_id": user_id,
            "type": c_type,
            "link": c_link,
            "description": c_description
        };
    }

    if (usertype == "production") {
        var p_type = document.getElementById('production-type').value;
        var p_desc = document.getElementById('production-desc').value;
        var p_status = document.getElementById('production-status').value;
        var p_link = document.getElementById('production-link').value;
        var p_opening = document.getElementById('production-opening').value;
        var p_closing = document.getElementById('production-closing').value;

        console.log('production type ', p_type);
        data = {
            "user_id": user_id,
            "description": p_desc,
            "type": p_type,
            "link": p_link,
            "status": p_status,
            "opening_date": p_opening,
            "closing_date": p_closing
        };
    }

    if (usertype == "personal") {
        var per_dob = document.getElementById('personal-dateOfBirth').value;
        var per_type = document.getElementById('personal-type').value;
        var per_headline = document.getElementById('personal-headline').value;

        data = {
            "user_id": user_id,
            "date_of_birth": per_dob,
            "headline": per_headline,
            // "career": per_career_list,
            "profile_type": per_type
        };
    }

    // var url = "https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/" + usertype + "_update";
    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/" + usertype + "_update";

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

                // go to newsfeed
                window.location.href = "Newsfeed/newsfeed.html";

            }
        })

}

function signin() {

    var email = document.getElementById('signin-email').value;
    var password = document.getElementById('signin-password').value;
    var error_message = validateSigninInput(email, password);


    document.getElementById("loginBtn").disabled = true;
    document.getElementById("loginBtn").classList.add('btnDisabled');
    document.getElementById("body").style.cursor = "wait";


    // var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/login';
    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/login";

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
    })
        .then(res => res.json())
        .catch(error => {
            createCustomAlert(error);
            console.error('Error:', error);
        })
        .then(response => {

            document.getElementById("loginBtn").disabled = false;
            document.getElementById("body").style.cursor = "default";

            if (response.statusCode == 400 && response.reason == "WRONG_PASSWORD") {

                createCustomAlert(response.message);


            } else if (response.status == "success") {

                console.log(response);

                var token = response.response.token;
                var user_image = response.response.user.image;
                var user_id = response.response.user_id;
                var handle = response.response.user.handle;
                var res_usertype = response.response.user.usertype;
                var firstname = response.response.user.firstname;
                var lastname = response.response.user.lastname;
                var city = response.response.user.city;
                var country = response.response.user.country;

                if (res_usertype == "company") {
                    res_usertype_id = response.response.user.company;
                    console.log('usertype id in register.js', res_usertype_id);
                    // var company_name = response.response.company.name;
                    // console.log(company_name);
                    // response.response.company.name;

                    localStorage.setItem("company_name", response.response.company.name);

                }
                if (res_usertype == "production") {
                    res_usertype_id = response.response.user.production;
                    console.log('usertype id in register.js', res_usertype_id);
                    // var production_name = response.response.production.name;

                    // localStorage.setItem("production_name", production_name);

                }
                if (res_usertype == "personal") {
                    res_usertype_id = response.response.user.personal;
                    console.log(response.response)
                    localStorage.setItem("headline", response.response.personal.headline)
                    localStorage.setItem("job_title", response.response.personal.job_title)
                    localStorage.setItem("job_company", response.response.personal.job_company)
                    localStorage.setItem("prev_job", response.response.personal.prev_job)
                    localStorage.setItem("prev_company", response.response.personal.prev_company)
                    console.log('usertype id in register.js', res_usertype_id);

                    localStorage.setItem("first_name", firstname);
                    localStorage.setItem("last_name", lastname);

                }

                localStorage.setItem("token", token);
                localStorage.setItem("profile_image", user_image);
                localStorage.setItem("user_id", user_id);
                localStorage.setItem("handle", handle);
                localStorage.setItem("usertype", res_usertype);
                //localStorage.setItem("usertype_id", res_usertype_id);
                localStorage.setItem("city", city);
                localStorage.setItem("country", country);

                var res_lastname = response.response.user.lastname;
                var res_firstname = response.response.user.firstname;
                if (localStorage.getItem("token") == "") {
                    createCustomAlert("WARNING: Not saved locally");
                } else {
                    document.getElementById("loginBtn").disabled = false;
                    document.getElementById("body").style.cursor = "pointer";
                    window.location.href = "Newsfeed/newsfeed.html";


                    document.getElementById("loginBtn").disabled = false;
                    document.getElementById("loginBtn").classList.remove('btnDisabled');
                    document.getElementById("body").style.cursor = "pointer";
                }
            }
        })
        .then(error => {
            console.log('error bad request', error);
            createCustomAlert('This Account Does Not Exits');
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

function validateSignUpInput(e, p, fn, ln, h, ut) {
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
    } else {
        return '';
    }
}

function checkIfFieldEmpty(x) {

    if (x == "" || x == null) {
        return true; // is empty
    } else {
        return false;
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

function handleIsUnique(fetched_handle) {

    if (fetched_handle == "" || fetched_handle == null) {
        createCustomAlert("Please Enter Username");
        return
    }
    // api call to check if unique

    // var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/is_unique';
    var url = "https://broadwayconnected.bubbleapps.io" + version_change + "api/1.1/wf/is_unique";

    var data = {
        "handle": fetched_handle
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

            console.log('Success unique handle request:', response);

            if (response.status == "success") {

                console.log(response);
                if (response.response.message == "yes") {
                    console.log('username unique');
                }
                if (response.response.message == "no") {
                    createCustomAlert("Username Not Unique");
                }
            }
        })
}

function checkPasswordsMatch(fetched_password, fetched_confirm_password) {
    console.log('pwd 1:', fetched_password);
    console.log('pwd 2:', fetched_confirm_password);

    if (fetched_password == "") {
        createCustomAlert("Please Enter Password");
    } else if (fetched_password !== fetched_confirm_password) {
        console.log('here');
        createCustomAlert("Your Passwords Don't Match");
    }
}

function checkPhoneNumber(fetched_phone_number) {
    var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;  //international phone number

    if (regex.test(fetched_phone_number)) {
        // Valid international phone number
        var regex_next = /^([0-9])\1*$/; // check if all numbers are same
        if (regex_next.test(fetched_phone_number)) {
            createCustomAlert("Please Enter Valid Phone Number");
        }

    } else {
        // Invalid international phone number
        createCustomAlert("Please Enter Valid Phone Number");
    }
}

function checkEmail(fetched_email) {
    // var fetched_email = document.getElementById("signup-email").value;
    var atpos = fetched_email.indexOf("@");
    var dotpos = fetched_email.lastIndexOf(".");
    console.log('In validate email inside', fetched_email);
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= fetched_email.length) {
        createCustomAlert("Please Enter Valid Email Address");
    }
}