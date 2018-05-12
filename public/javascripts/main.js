/*

Anytime you see the $ sign in JavaScript - that is a reference to the JQuery library. JQuery helps you do common things easier. 
In this case, this "ready" call is a function that is called when the page has loaded and is ready -
this is important cos you want to make sure everything is loaded and available before referencing it
*/ 
$(document).ready(function () {

    // can is a variable that will get the canvas element that has an ID of photo
    var can = document.getElementById("photo");
    // v is a variable that will get a reference to the video item. We need video for the webcam!
    var v = document.getElementById('camera');
    // Context is used to get the drawing context - its how we draw and get data from the canvas!
    var context = can.getContext('2d');
    // detectUrl is the API endpoint - its where we want to ping and we are looking to detect emotion. See the 
    // Face API from MSFT for more information
    var detectUrl = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=emotion"
    // Listen. We don't really want this on the client side as that is a security issue. We should ideally remove
    // this and then put it only on the local mirror we are using
    var subscriptionKey = "2def81deb31f413cbb2255fb1af7ec9d";
    // Here we are setting the width and the height of the canvas. We might want to change this. 
    can.style.width = window.innerWidth + "px";
    can.style.height = window.innerHeight + "px";
    // Here we are checking to see if we can get User Media 
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
        // Hey, if there is getUserMedia and it returns turn, we're gonna ask for that video feed!
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

    /* findOut - This function takes photo data and then will call the detectFaces */
    function findOut(photo) {
        console.log("findOut function called");
        // detect all faces in photo and try to identify if any of them are willman
        detectFaces(photo)
          .then((response) => response.json())
          .then(function(response){
            console.log("Hey this is our data",response);
            processDataFromAPI(response);

          })
      }

      function processDataFromAPI(response){


        console.log(response);
        

      }

      function getGeneralScore(){


      }
    
      /*
    Function to check the Image - this will get the data image from the Canvas context and then convert it to a blob.
    When that is done, it will call the "findOut" function
    */
    function checkImage(){

        can.toBlob(findOut);
      
    }

    /* This will always show the image on the context*/
    function showImage() {
        console.log("show image")
        context.drawImage(v, 0, 0, can.width, can.height);
    }

    //Call Show Image every 1 ms - so that we are updating that canvas
    setInterval(showImage, 1);
    //Call the api to check every 10 seconds at the moment. 
    // Might need to change! 
    setInterval(checkImage,10000);
    
    /*
    
    Function to detect Faces - we need photo data from the blob
    It returns the result. 
    */

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








