$(document).ready(() => { var dailyInfo; 
    setInterval(printDate, 1000);
    setInterval(updateSunLocation, 2000);
    getNewData();
    setInterval(getNewData, 1000*60*60); 
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
    function updateSunLocation(){
        $('#sunImage').remove();
        if(sunIsDown(dailyInfo))
        {
            setTimeout()
            var moonImage = "<img id='moonImage' src='images/moon.png'></img>";
            var centerDiv = $("#sunDisplay");
            centerDiv.append(moonImage);
            console.log("night night");
        }
        else
        {
            var sunPercent = getSunPercentage(dailyInfo);
            const hypot = 6;
            if(sunPercent>90){
                sunPercent = 180 - sunPercent;
            }
            const sunLength = Math.cos(sunPercent*(Math.PI/180.0))*hypot;
            const sunHeight = Math.sqrt((Math.pow(hypot,2)-Math.pow(sunLength,2)));
            var center = $('#centersun');    
            var centerPos = center.position();
            var sunImage = "<img id='sunImage' src='images/sun.jpg'></img>";
            $('body').append(sunImage); 
            var killme = $('#sunImage');
            killme.css("top",centerPos.top-sunHeight*50);
            killme.css("left", centerPos.left+sunLength*50);
            console.log(centerPos);
            console.log(killme.position());
      }
    }
    function getForecast(darkSkyURL){
        $.getJSON(darkSkyURL, function(data){
            var currently = data.currently;
            var today = data.daily.data[0];
            dailyInfo = today;
            console.log(today);
            console.log(currently);            
       });
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
            console.log(solarnoon);         
    }
    function sunIsDown(todayInfo){
        var timeRightNow = new Date();
        var seconds = (timeRightNow.getTime())/1000;
        if(seconds > todayInfo.sunsetTime || seconds < todayInfo.sunriseTime){
            return true;
        }else{
            return false;
        }
    }      
});
