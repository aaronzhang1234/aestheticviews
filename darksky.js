$(document).ready(() => { 
    var dailyInfo; 
    var currentInfo;
    setInterval(printDate, 1000);
    getNewData();
    setInterval(getNewData, 1000*30); 
    $(window).on('resize', function(){
        updateSunLocation();
        console.log("resized");
    });
    var fuckCors = "https://cors-anywhere.herokuapp.com/";
    function printDate(){
        var today = new Date().toLocaleTimeString();
        $('#time').text(today);
    }

    function getNewData(){
        if(navigator.geolocation)
        {
            console.log("hello");
            navigator.geolocation.getCurrentPosition(showPosition, errored);
        }
    }
    function showPosition(position){
       var lati = position.coords.latitude;
       var longi = position.coords.longitude;
       $.getJSON("config.json", function(data){
           console.log(data);
           var darkSkyURL = "https://api.darksky.net/forecast/" + data.darkskykey + "/" + lati + "," + longi;
           var darkSkyURL = fuckCors + darkSkyURL; 
           getForecast(darkSkyURL); 
       });
    }
    function errored(){
        console.log("broken");
    } 
    function getForecast(darkSkyURL){
        $.getJSON(darkSkyURL, function(data)
        {
            var currently = data.currently;
            var today = data.daily.data[0];
            dailyInfo = today;
            currentInfo = currently;
            console.log(today);
            console.log(currently);            
            updateSunLocation();
            updateSkyColor();
            updateTemperature();
            shiftText();
       });
    }
    function updateSunLocation(){
        $('#sunImage').remove();
        var center = $('#centersun');    
        var centerPos = center.position(); 
        if(sunIsDown(dailyInfo))
        {  
            placeMoon();
        }
        else
        {
            placeSun();
        }
    }
    function getSunPercentage(todayInfo){
        var totalSunUpness = todayInfo.sunsetTime - todayInfo.sunriseTime;
        var timeRightNow = (new Date().getTime())/1000;
        var timeElapsed = timeRightNow - todayInfo.sunriseTime;
        var sunpercentage = timeElapsed/totalSunUpness;
        return sunpercentage * 180;
    }
    function getSolarNoon(todayInfo){
        var solarnoon = new Date(0);
        solarnoon.setUTCSeconds((todayInfo.sunsetTime + todayInfo.sunriseTime) /2);
    }
    function sunIsDown(todayInfo){
        var timeRightNow = new Date();
        var seconds = (timeRightNow.getTime())/1000;
        if(seconds > todayInfo.sunsetTime || seconds < todayInfo.sunriseTime)
        {
            return true;
        }
        else
        {
            return false;
        }
    }      
    function placeMoon(){
        var center = $('#centersun');    
        var centerPos = center.position();  
        $('#moonImage').remove();
        var moonImage = "<img id='moonImage' src='images/moon.png'></img>";
        var centerDiv = $("#skyDisplay");
        centerDiv.append(moonImage);
        var moonImage = $('#moonImage');
        console.log(centerPos);
        var moonWidth = moonImage.width()/4;
        console.log(moonWidth);
        moonImage.css("top",centerPos.top-150);
        moonImage.css("left", centerPos.left-moonWidth);
    }
    function placeSun(){
        var center = $('#centersun');    
        var centerPos = center.position();   
        var sunPercent = getSunPercentage(dailyInfo);
        const hypot = 6;
        if(sunPercent>90)
        {
            sunPercent = 180 - sunPercent;
        }
        const sunLength = Math.cos(sunPercent*(Math.PI/180.0))*hypot;
        const sunHeight = Math.sqrt((Math.pow(hypot,2)-Math.pow(sunLength,2)));
        var sunImage = "<img id='sunImage' src='images/sun.jpg'></img>";
        $('body').append(sunImage); 
        var killme = $('#sunImage');
        var sunWidth = killme.width()/2;
        killme.css("top",centerPos.top-sunHeight*50);
        killme.css("left", centerPos.left+((sunLength*50)-sunWidth));
    }
    function updateSkyColor(){
        var skyDisplay = $("#skyDisplay"); 
        if(sunIsDown(dailyInfo))
        {
            skyDisplay.css("background-color","black");
        }
        else
        {
            var skyColors = ["66ccff",
                             "6dc8fb",
                             "73c5ee",
                             "7ac2e5",
                             "81bedd",
                             "88bad4",
                             "8eb7cb",
                             "95b4c3",
                             "9cb0ba",
                             "a2acb2",
                             "a9a9a9"];
            var cloudCover = currentInfo.cloudCover; 
            var skyColorBasedOnClouds = Math.floor(cloudCover*10);
            var currentSkyColor = skyColors[skyColorBasedOnClouds];
            skyDisplay.css("background-color","#"+currentSkyColor);
        }
    }
    function updateTemperature(){
        var temperature = currentInfo.temperature;
        $('#temperature').text(temperature);
    }
    function shiftText(){
        if(sunIsDown(dailyInfo))
        {
            $("#time").css("color","white");
            $("#temperature").css("color","white");
            $("#centersun").css("background-color","white");
        }
        else
        {
            $("#time").css("color","black");
            $("#temperature").css("color","black");
            $("#centersun").css("background-color","black");

        }
    }
});
