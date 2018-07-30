function getCompanyProfileDataForCompany(){
    // get company data by fetch call
    var unique_id = localStorage.getItem("user_id");
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
                // checkIfFollowing(unique_id);
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
                var handle = response.response.company.handle;
                
                document.getElementById('company_image_here').src = profile_image;
                document.getElementById('useras_company_name').innerHTML = fullName;
                document.getElementById('useras_company_handle').innerHTML = "@" + handle;

            }
        })
   
}
