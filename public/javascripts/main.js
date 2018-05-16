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
    var timeHolder = document.getElementById("time");
    console.log(timeHolder);
    var weather = document.getElementById("weather");
    var weathericon = document.getElementById("weathericon");
    // bad mix of vanilla and jquery. ooops


    /* Emotion Images Object */
        var emotionImages = {};
        emotionImages["anger"] = "anger.svg";
        emotionImages["happiness"] = "happiness.svg";
        emotionImages["sadness"] = "sadness.svg";
        emotionImages["fear"] = "fear.svg";
        emotionImages["contempt"] = "contempt.svg";
        emotionImages["disgust"] = "disgust.svg";
        emotionImages["neutral"] = "neutral.svg";
        emotionImages["surprise"] = "surprise.svg";


    $('#sendbutton').click(function (eObject) {
        console.log("click handlers");
        //checkImage();
    })

    function checkImage() {
        console.log("CheckImage called");
        can.toBlob(findOut);
        console.log("look at me")
    }

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
        /*Alex - you should write a check here to determine IF there is an image - if someone hasn't accepted the 
        use of their camera, there will be no image.... hence no width or height. We shouldn't call the api if we 
        have no data! */
        // detect all faces in photo and try to identify if any of them are willman
        detectFaces(photo)
            .then((response) => response.json())
            .then(function (response) {
                console.log("Detected faces: response", response);
                processDataFromAPI(response);
            })
    }

    function processDataFromAPI(response) {
        console.log("process data from api");
        console.log(response)
        var len = response.length;
        console.log(len);
        for (var i = 0; i < len; i++) {
            var face = response[i];
            var faceAttributeObject = face['faceAttributes'];
            console.log(faceAttributeObject);
            var emotionObject = faceAttributeObject['emotion'];
            console.log(emotionObject);
            console.log("get the emottion");
            var mainEmotion = getHighestEmotion(emotionObject);
            console.log("Main Emotion" + mainEmotion);
            showEmotion(mainEmotion);
        }
    }

    function showEmotion(mainEmotion) {
        $("#emotions").removeClass();
        $('#emotions').addClass(mainEmotion);
        $('#emotions').addClass('emotions');
    }

    /* 
        Function to get the Emotion that rated the highest. 
        
    */
    function getHighestEmotion(emotion) {
        var item = 'neutral';// just defaulting the variable to neutral 
        var emotionValue = 0;
        for (var i in emotion) {
            if (emotion[i] > emotionValue) {
                emotionValue = emotion[i];
                item = i;
            }
        }
        return item;
    }




    /*
  Function to check the Image - this will get the data image from the Canvas context and then convert it to a blob.
  When that is done, it will call the "findOut" function
  */
    function checkImage() {
        can.toBlob(findOut);
    }

    /* This will always show the image on the context*/
    function showImage() {
        console.log("show image")
        context.drawImage(v, 0, 0, can.width, can.height);
    }
    function showTime() {
        var currentTime = moment().format('LT');
        $(timeHolder).text(currentTime);
    }

    function showItems() {
        showTime();
        showImage();
        checkImage();
    }
    setInterval(showItems, 10000);

    showTime();


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

    /*
    Get Weather - Will call teh open weather map and get the weather. We then determine teh class name based on the
    ID returned. If you want to make this icon big - you do it in style sheets. Treat it like a font - so you would do something like
    font-size:48px for example. This is how you resize it. 
    */
    function getWeather() {
        $.get("http://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=52023b5a67ea9a8811e25266368056b5", function (data) {

            console.log(data)
            console.log(data.weather[0])
            console.log(data.weather[0].icon)
            console.log(getClassForWeather(data.weather[0].id, data.weather[0].icon));
            $(weather).text(data.weather[0].description);
            var weatherClassName = getClassForWeather(data.weather[0].id, data.weather[0].icon);
            $(weathericon).removeClass();
            $(weathericon).addClass("wi");
            $(weathericon).addClass(weatherClassName);

        });
    }
    getWeather();

    /*
    This function checks to see what class name to return to use for the icon, shouldn't need to be touched but coudl be improved!
    */
    function getClassForWeather(id, icon) {

        var isNight = (icon.indexOf('n') > -1) ? true : false;
        var isDay = (icon.indexOf('d') > -1) ? true : false;

        var className = "";
        if (isNight && !isDay) {
            className = "wi-owm-night-";
        } else if (isDay && !isNight) {
            className = "wi-owm-day-";
        } else {
            className = "wi-own-";
        }
        className += id;
        console.log(className);
        return className;

    }

});







