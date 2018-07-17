function fetchProfileData() {

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
                console.log('response response',response.response);

            }
        })
}