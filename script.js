$(document).ready(() => {
    var baseURLWeather = "https://api.weather.gov/";  
    var baseURLSunset  = "https://api.sunrise-sunset.org/json?"; 
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
       var weatherLoc = baseURLWeather + 'points/' + lati + ',' + longi;
       var sunsetLoc  = baseURLSunset +'lat=' + lati + '&lng=' + longi + '&date=today';
       console.log(sunsetLoc)
       getSunset(sunsetLoc);
       $.getJSON("config.json", function(data){
           console.log(data);
       });
       getForecast(weatherLoc);
    }
    function errored(){
        console.log("broken");
    } 
    function getForecast(forecastLink){
        $.getJSON(forecastLink, function(data){
           var location = data.properties.relativeLocation.properties;
           var properties = data.properties;
           $('#city').text("City is: "+location.city);
           $('#state').text("State is: "+ location.state);
           forecastPrintout(properties.forecast);
           hourlyPrintout(properties.forecastHourly);           
        }) 
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
            var periods = data.properties.periods;
            var hourlyDiv = $('#hourly');
            for(var i=0; i<24; i++){
                var currentHourlyData = periods[i]; 
                var currentHour = convert24to12(currentHourlyData.startTime);
                var hourBlock = "<div class='hourBlock' id='"+currentHour+"'></div>";
                hourlyDiv.append(hourBlock);
                hourBlock = $('#'+currentHour);
                var hourText = "<h3 class='hourText'>"+currentHour + "</h3>";
                var hourImage = "<img src='"+currentHourlyData.icon+"'></img>";
                var hourTemp = "<h3 class='hourText'>"+currentHourlyData.temperature+"</h3>";
                hourBlock.append(hourText);
                hourBlock.append(hourImage);
                hourBlock.append(hourTemp);
            }
        });
    }       
    function convert24to12(weatherTime){
        var hour24 = Number(weatherTime.substring(11,13)); 
        var period = getPeriod(hour24);
        var hour12 = get12Hour(hour24); 
        return hour12+period;
    }
    function getPeriod(hour){
        return hour>=12?"pm":"am";
    }
    function get12Hour(hour24){
        if(hour24==0){
            return 12;
        }else if(hour24>12){
            return hour24-12;
        }else{
            return hour24;
        }
    }
    function getSunset(sunsetLink){
        $.getJSON(sunsetLink, function(data){
            console.log(data);
        });
    }
});
