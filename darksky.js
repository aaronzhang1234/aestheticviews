$(document).ready(() => { 
    var dailyInfo; 
    var currentInfo;
    var currentClouds = 0;
    var fuckCors = "https://cors-anywhere.herokuapp.com/";

    setInterval(printDate, 1000);
    setInterval(getNewData, 1000*60*2); 
    getNewData();

    $(window).on('resize', function(){
        updateSunLocation(currentInfo,dailyInfo);
    });

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
            var rightNow = data.currently;
            var today = data.daily.data[0];
            dailyInfo = today;
            currentInfo = rightNow;
            console.log(today);
            console.log(rightNow);            
            updateSunLocation(rightNow, today);
            updateWeather(rightNow, today);
            shiftText(today);
       });
    }
    function updateSunLocation(rightNow, today){
        $('#sunImage').remove();
        var center = $('#centersun');    
        var centerPos = center.position(); 
        if(sunIsDown(today))
        {  
            placeMoon();
        }
        else
        {
            placeSun(rightNow, today);
        }
    }
    function updateWeather(rightNow, today){
        updateTemperature(rightNow);
        updateSkyColor(rightNow, today);
        var numOfClouds = Math.ceil((rightNow.cloudCover) *100);
        if(numOfClouds > currentClouds+5 || numOfClouds < currentClouds-5){
            currentClouds = numOfClouds;
            $('.cloud').remove();
            for(numOfClouds; numOfClouds>0; numOfClouds--){
               placeCloud(numOfClouds);
            }
        }
    }
    function getSunPercentage(today){
        var totalSunUpness = today.sunsetTime - today.sunriseTime;
        var timeRightNow = (new Date().getTime())/1000;
        var timeElapsed = timeRightNow - today.sunriseTime;
        var sunpercentage = timeElapsed/totalSunUpness;
        return sunpercentage * 180;
    }
    function getSolarNoon(today){
        var solarnoon = new Date(0);
        solarnoon.setUTCSeconds((today.sunsetTime + todayInfo.sunriseTime) /2);
    }
    function sunIsDown(today){
        var timeRightNow = new Date();
        var seconds = (timeRightNow.getTime())/1000;
        if(seconds > today.sunsetTime || seconds < today.sunriseTime)
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
        var moonWidth = moonImage.width()/4;
        moonImage.css("top",centerPos.top-150);
        moonImage.css("left", centerPos.left-moonWidth);
    }
    function placeSun(rightNow, today){
        var center = $('#centersun');    
        var centerPos = center.position();   
        var sunPercent = getSunPercentage(today);
        const hypot = 6;
        var sunLength;
        var sunHeight;
        if(sunPercent>90)
        {            
            sunPercent = 180 - sunPercent;
            sunLength = Math.cos(sunPercent*(Math.PI/180.0))*hypot;
            sunHeight = Math.sqrt((Math.pow(hypot,2)-Math.pow(sunLength,2)));
        }
        else
        {
            var sunRadians = sunPercent * (Math.PI/180);
            sunLength = Math.cos(sunRadians)*hypot;
            sunLength = sunLength*-1
            sunHeight = Math.sqrt((Math.pow(hypot,2)-Math.pow(sunLength,2)));
        }
        var sunImage = "<img id='sunImage' src='images/sun.png'></img>";
        $('body').append(sunImage); 
        var killme = $('#sunImage');
        var sunWidth = killme.width()/2;
        killme.css("top",centerPos.top-sunHeight*50);
        killme.css("left", centerPos.left+((sunLength*50)-sunWidth));
    }
    function updateSkyColor(rightNow, today){
        var skyDisplay = $("#skyDisplay"); 
        if(sunIsDown(today))
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
            var cloudCover = rightNow.cloudCover; 
            var skyColorBasedOnClouds = Math.floor(cloudCover*10);
            var currentSkyColor = skyColors[skyColorBasedOnClouds];
            skyDisplay.css("background-color","#"+currentSkyColor);
        }
    }
    function updateTemperature(rightNow){
        var temperature = rightNow.temperature;
        $('#temperature').text(temperature);
    }
    function placeCloud(numOfClouds){
        var cloudID = "cloud" + numOfClouds;
        var cloudImage = "<img class='cloud' id='"+ cloudID +"' src='images/cloud.png'></img>";
        $('#skyDisplay').append(cloudImage);
        cloudImage = $('#'+cloudID);
        var cloudHorzPos = (Math.random() * 20) +40;
        var cloudVertPos = (Math.random() * 100);
        cloudImage.css("top", cloudHorzPos + "vh");
        cloudImage.css("left", cloudVertPos + "vw");
    }
    function shiftText(today){
        if(sunIsDown(today))
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
