$(document).ready(() => {
    var baseURL = "https://api.weather.gov/";  
    setInterval(printDate, 1000);
    getNewData();
    setInterval(getNewData, 1000*60*60);
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
       var posit = baseURL+"points/"+lati+","+longi;
       console.log(posit);
       $.getJSON(posit, function(data){
           var location = data.properties.relativeLocation.properties;
           var properties = data.properties;
           $('#city').text("City is: "+location.city);
           $('#state').text("State is: "+ location.state);
           forecastPrintout(properties.forecast);
           
       }) 
    }
    function errored(){
        console.log("broken");
    } 
    function forecastPrintout(forecastLink){
        $.getJSON(forecastLink, function(data){
            var forecasts = data.properties.periods;
            for(var i = 0; i<forecasts.length; i++)
            {
                var currentForecast = forecasts[i];
                var dayName = currentForecast.name;
                var dayNameForID = dayName.replace(/ /g,''); 
                var weatherBlock = "<div class='dayBlock' id='"+ dayNameForID +"'></div>";
                $('#forecasts').append(weatherBlock);
                var weatherDay = "<h3 class='dayText'>"+ dayName +"</h3>";
                $('#'+dayNameForID).append(weatherDay);
                var weatherImage = "<img class='dayImage' src='"+ currentForecast.icon +"'></img>";
                $('#'+dayNameForID).append(weatherImage);
                var weatherTemp = "<h3 class='dayTemp'>"+ currentForecast.temperature +"</h3>"; 
                $('#'+dayNameForID).append(weatherTemp);
            }
        })
    }
    function hourlyPrintout(hourlyForecastLink){
        $.getJSON(hourlyForecastLink, function(data){
            console.log(data);
        });
    }       
});
