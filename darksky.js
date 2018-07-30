$(document).ready(() => {
    setInterval(printDate, 1000);
    getNewData();
    setInterval(getNewData, 1000*60*60); var fuckCors = "https://cors-anywhere.herokuapp.com/";
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
        $.getJSON(darkSkyURL, function(data){
            var currently = data.currently;
            var today = data.daily.data[0];
            if(sunIsDown(today)){
                console.log("Nighty Night");
            }else{
                console.log("Sun is currently: " + getSunPercentage(today));             
            }
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
        var timeRightNow = (new Date().getTime())/1000;
        if(timeRightNow > todayInfo.sunsetTime || timeRightNow < todayInfo.sunriseTime){
            return true;
        }else{
            return false;
        }
    }      
});
