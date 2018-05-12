$(document).ready(function () {
    var can = document.getElementById("photo");
    var v = document.getElementById('camera');
    var context = can.getContext('2d');
    var detectUrl = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=emotion"
    var subscriptionKey = "2def81deb31f413cbb2255fb1af7ec9d";
    var timeHolder = document.getElementById("time");
    console.log(timeHolder);
    // bad mix of vanilla and jquery. ooops


    $('#sendbutton').click(function(eObject){
        console.log("on Click yo")
       //checkImage();
    })

    function checkImage(){
        console.log("CheckImage called");
        can.toBlob(findOut);
        console.log("look at me")
    }



    can.style.width = window.innerWidth + "px";
    can.style.height = window.innerHeight + "px";
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        // Request access to video only
        navigator.getUserMedia(
            {
                video: true,
                audio: false
            },
            function (stream) {
                var url = window.URL || window.webkitURL;
                v.src = url ? url.createObjectURL(stream) : stream;
                v.play();
                var c = document.getElementById('photo');
                console.log(c);
                var context = c.getContext('2d');
                context.drawImage(v, 0, 0, c.width, c.height);

            },
            function (error) {
                alert('Something went wrong. (error code ' + error.code + ')');
                return;
            }
            );
    }
    else {
        alert('Sorry, the browser you are using doesn\'t support getUserMedia');
        return;
    }

    function findOut(photo) {
        console.log("Find out");
        // detect all faces in photo and try to identify if any of them are willman
        detectFaces(photo)
          .then((response) => response.json())
          .then(function(response){
            console.log("Hey this is our data",response);

          })
      }
    function showItems(){
        showImage();
        showTime();
    }

    function showImage() {
        console.log("show image")
        context.drawImage(v, 0, 0, can.width, can.height);
    }
    function showTime(){
        var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $(timeHolder).text(currentTime);
    }
    setInterval(showItems, 1);
    //another interval to check the image
    setInterval(checkItems,10000);
    

    function detectFaces(photo) {
        var options = {
          method: "POST",
          body: photo,
          headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": subscriptionKey
          }
      
        };

    


        console.log(options);
        console.log(subscriptionKey)
        return fetch(detectUrl, options);
      }

});








