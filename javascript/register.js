function register()
{ 
    alert("1");
  var username=document.getElementById('signup-username').value;
  var email=document.getElementById('signup-email').value;
   var password=document.getElementById('signup-password').value;
//    alert(username+"---"+password);

var url = 'http://app.bwayconnected.com/api/register';
var data = {
    "email": "poiuy+11@gmail.com",
    "password": "1234567",
    "first_name": "A",
    "last_name": "M"
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

    // check if sign up successful
    if(response.Response == 1000)
    {
        alert("User Already Exists");
    }else{
        alert(response.Result.user_id);
        console.log('Success:', response)
        var user_id_value = response.Result.user_id;
    
        setCookie('user_id',user_id_value,7);
        var xx = getCookie('user_id');
    
        if (xx !== "") {
           alert("cookie saved "+ xx);
        }else{
            alert("cookie not found ");
        }
    }
    
})

}
function setCookie(cname,cvalue,exdays) {
	alert("in set cookie");
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    alert("in get cookie");
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
	
    var user=getCookie("user_id");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
    //    user = prompt("Please enter your name:","");
    //    if (user != "" && user != null) {
    //        setCookie("username", user, 30);
    //    }
    alert("No cookies yet");
    }
}