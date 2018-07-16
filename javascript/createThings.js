// createThings

function getCompaniesProduction() {

    var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/fetch_companies_productions';
    // var url = 'https://broadwayconnected.bubbleapps.io/api/1.1/wf/fetch_companies_productions';

    var data = {
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
            // createCustomAlert(error);
            console.error('Error:', error);
        })
        .then(response => {
            if (response.status == "success") {
                var datalist = document.getElementById('comp-prod-list');
                var datalist_innerHTML_list = "";

                //   get companies

                if (response.response.companies.length > 0) {
                    response.response.companies.forEach(function (element) {
                        // console.log(element.name);
                        datalist_innerHTML = "<option data-value='c" + element._id + "' value='" + element.name + "'>";
                        datalist_innerHTML_list += datalist_innerHTML;
                    });
                }

                // get productions

                if (response.response.productions.length > 0) {
                    response.response.productions.forEach(function (element) {
                        // console.log(element.name);
                        datalist_innerHTML = "<option data-value='p" + element._id + "' value='" + element.name + "'>";
                        datalist_innerHTML_list += datalist_innerHTML;
                    });
                }

                datalist.innerHTML = datalist_innerHTML_list;

                // var token = response.response.token;
            }
        })

}

function createAlertTest() {
    var shownVal = document.getElementById("city").value;
    var value = document.querySelector("#comp-prod-list option[value='" + shownVal + "']");
    var value_dataset = "";
    if (value == null) {
        createCustomAlert("new value");
    } else {
        value_dataset = value.dataset.value;
        createCustomAlert(value_dataset);
    }
}

function createMilestone() {
    //check if all fields 
    var milestoneType = document.getElementById('milestone-type').value;

    if (milestoneType == "") {
        createCustomAlert('Please Select Milestone First');
        return
    }

    var ft1 = document.getElementById('milestone-fixed-text1').innerHTML;
    var role = document.getElementById('milestone-text1').value;
    var ft2 = document.getElementById('milestone-fixed-text2').value;
    var description = document.getElementById('milestone-description').value;
    var org_name = "";
    var org_type = "";
    var org_id = "";

    // get org info

    var shownVal = document.getElementById("city").value;

    if (role == "") {
        createCustomAlert('Tell Us About Your Role');
        return
    }

    if (shownVal == "") {
        createCustomAlert('Please Enter the Production / Company');
        return
    }

    var value = document.querySelector("#comp-prod-list option[value='" + shownVal + "']");
    var value_dataset = "";
    if (value == null) {
        org_name = shownVal;
        org_type = "";
        org_id = "";
    } else {
        value_dataset = value.dataset.value;
        org_name = shownVal;
        org_type = value_dataset.charAt(0);
        org_id = value_dataset.substring(1);
    }

    var token = localStorage.getItem("token");
    //make the api call
    var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/milestone_create';
    // var url = 'https://broadwayconnected.bubbleapps.io/api/1.1/wf/milestone_create';

    var data = {
        "role": role,
        "description": description,
        "type": milestoneType,
        "org_id": org_id,
        "org_name": org_name,
        "org_type": org_type,
        "ft1": ft1,
        "ft2": ft2
    };

    console.log('data : ', data)

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .catch(error => {
            console.error('Error:', error);
        })
        .then(response => {
            if (response.status == "success") {
               console.log('create milestone response: ',response);
            }
        })

    //get result

}

function checkIfMilestoneTypeSelected() {
    if (document.getElementById('milestone-type').value == "") {
        createCustomAlert('Please Select Milestone Type First');
    } else {
        return true;
    }
}
