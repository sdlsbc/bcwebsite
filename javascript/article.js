var upload_article_base64 = "";

function getArticleImage(event) {
    var myCanvas = document.getElementById('myArticleCanvas');
    var ctx = myCanvas.getContext('2d');
    var img = new Image();
    img.onload = function () {
        myCanvas.width = img.width;
        myCanvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        upload_article_base64 = myCanvas.toDataURL('image/jpeg');
        console.log('upload_article_base64 ---', upload_article_base64);
    };

    img.src = URL.createObjectURL(event.target.files[0]);
}

function create_article() {
    var art_header = document.getElementById('articles-header').value;
    var art_title = document.getElementById('articles-title').value;
    var art_body = document.getElementById('articles-body').value;
    var art_tag = document.getElementById('articles-tag').value;
    var art_image = upload_article_base64;
    console.log('art_header', art_header);
    var user_id = localStorage.getItem("user_id");
    // console.log('upload_article_base64',upload_article_base64);

     var url = "https://broadwayconnected.bubbleapps.io"+version_change+"api/1.1/wf/post_create";
    //  var url = 'https://broadwayconnected.bubbleapps.io/version-test/api/1.1/wf/post_create';

     var data = {
         "article_image": art_image,
         "heading": art_header,
         "title": art_title,
         "publisher_id": user_id,
        //  "tags": art_tag,
        "description": art_body
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
 
             console.log('Article Created', response);
 
             if (response.status == "success") {
                art_header.innerHTML = "";
                art_title.innerHTML = "";
                art_body.innerHTML = "";
                art_tag.innerHTML = "";
                art_header.value = "";
                art_title.value = "";
                art_body.value = "";
                art_tag.value = "";
                upload_article_base64 = "";
                createCustomAlert("Article Created Successfully");
                // art_header.innerHTML = "";
                // art_title.innerHTML = "";
                // art_body.innerHTML = "";
                // art_tag.innerHTML = "";
                // art_header.value = "";
                // art_title.value = "";
                // art_body.value = "";
                // art_tag.value = "";
                // upload_article_base64 = "";
             }
         })


}



