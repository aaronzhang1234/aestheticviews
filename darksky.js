$(document).ready(() => { 
    var dailyInfo; 
    var currentInfo;
    var currentClouds = 0;
    var fuckCors = "https://cors-anywhere.herokuapp.com/";
    var rainInterval;
    var rainArray;
    var viewportHeightPX = $(window).height();
    var viewportWidthPX = $(window).width();

    setInterval(printDate, 1000);
    setInterval(getNewData, 1000*60*5); 
    getNewData();
    placeStaticElements(); 
    $(window).on('resize', function(){
        updateSunLocation(currentInfo,dailyInfo);
        placeMinMax();
        placeStaticElements();
    });

    function printDate(){
        var today = new Date().toLocaleTimeString();
        $('#time').text(today);
    }
    function placeStaticElements(){
        placeTrees();    
    }
    function placeTrees(){  
        $('.trees').remove();
        var ground = $('#groundDisplay');
        var viewportHeightPX = $(window).height();
        var treeHeight = viewportHeightPX * .6;
        var treeHeightDifference = (viewportHeightPX * .4)/300;        
        console.log('hello');
        for(var i = 0; i < 250; i++){ 
            console.log('hello');
            var treeImage = "<img class='trees' id='tree"+ i +"' src='images/tree.png' />";
            ground.append(treeImage); 
            var imageWidth = (i * .1) + 5;
            var treeImage = $('#tree'+i);
            treeImage.css('top',treeHeight);
            treeHeightInPath = (viewportHeightPX*.4) - (viewportHeightPX - treeHeight);
            treeImage.css('width', imageWidth+'vw');
            var treeWidth = treeImage.width();
            treeImage.css('left', getLeft(treeHeightInPath, treeWidth));           
            treeHeight = treeHeight + treeHeightDifference; 
        }
        
    }
    function getLeft(height, width){
        var dirtPath = $('#dirtPath'); 
        var rectFullLength = dirtPath.outerWidth();
        var topLength = viewportWidthPX * .3;
        var rectHeight = viewportHeightPX * .3;
        var a = (rectFullLength - topLength)/2;
        var tanned = rectHeight/a;
        var rectSides = height/tanned;    
        var sidePath = (topLength/2) + rectSides;
        var halfWindow = viewportWidthPX * .5;
        var leftSidePath = halfWindow - sidePath;
        var rightSidePath  = halfWindow + sidePath;
        var treeLeft = Math.random() * viewportWidthPX;
        var treeWidthHalf = width/2;
        while((treeLeft > leftSidePath) && (treeLeft < rightSidePath))
        {
            console.log("hello");
            treeLeft = Math.random() * viewportWidthPX;
        }
        
        return treeLeft - treeWidthHalf;
    }
    function getNewData(){
        if(navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(showPosition, errored);
        }
        else
        {
            console.log("Could not get Navigator Geolocation");
            errored();
        }
    }
    function showPosition(position){
       console.log("Got Lat and Long from navigator Position");
       var lati = position.coords.latitude;
       var longi = position.coords.longitude;
       getWebsiteJSON(lati, longi);
    }
    function errored(){
        console.log("Got lat and Long from API");
        var latLongAPI = fuckCors + "http://ipinfo.io/geo";
        $.getJSON(latLongAPI, function(data){
            getWebsiteJSON2(data.loc);
        });
    } 
    function getWebsiteJSON2(loc){
        $.getJSON("config.json", function(data){
           var darkSkyURL = "https://api.darksky.net/forecast/" + data.darkskykey + "/" + loc;
           var darkSkyURL = fuckCors + darkSkyURL; 
           getForecast(darkSkyURL); 
       });
    }
    function getWebsiteJSON(latitude, longitude){
        $.getJSON("config.json", function(data){
           var darkSkyURL = "https://api.darksky.net/forecast/" + data.darkskykey + "/" + latitude + "," + longitude;
           var darkSkyURL = fuckCors + darkSkyURL; 
           getForecast(darkSkyURL); 
       });
 
    }
    function getForecast(darkSkyURL){
        $.getJSON(darkSkyURL, function(data)
        {
            var rightNow = data.currently;
            var today = data.daily.data[0];
            var hourly = data.hourly.data;
            dailyInfo = today;
            currentInfo = rightNow;
            updateSunLocation(rightNow, today);
            updateWeather(rightNow, today);
            updateHourly(hourly);
            shiftText(today);
       });
    }
    function updateSunLocation(rightNow, today){
        $('#sunImage').remove();
        $('#moonImage').remove();
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
        updateRain(rightNow.precipIntensity*10000);
        updateWind(rightNow.windSpeed);
        var numOfClouds = Math.ceil((rightNow.cloudCover) *100)*2;
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
        var windowHeight = (window.innerHeight)/2;
        moonImage.css("top", windowHeight);
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
            skyDisplay.css("background-color","#061928");
             $('#raining').css("background-color", '#061928');
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
            $('#raining').css("background-color", '#' + currentSkyColor);
        }
    }
    function updateTemperature(rightNow){
        var temperature = rightNow.temperature;
        $('#temperature').text(temperature+ String.fromCharCode(176));
    }
    function placeCloud(numOfClouds){
        var cloudID = "cloud" + numOfClouds;
        var cloudImage = "<img class='cloud' id='"+ cloudID +"' src='images/cloud.png'></img>";
        $('#skyDisplay').append(cloudImage);
        cloudImage = $('#'+cloudID);
        var cloudHorzPos = (Math.random() * 40);
        var cloudVertPos = (Math.random() * 110);
        var cloudSpeed = (Math.random() * 40)+ 80;
        var cloudDelay = -((Math.random() * 100) + 1);
        cloudImage.css("top", cloudHorzPos + "vh");
        cloudImage.css("left", cloudVertPos + "vw");
        cloudImage.css("animation-name", 'marquee');
        cloudImage.css("animation-duration", cloudSpeed+'s');
        cloudImage.css("animation-delay", cloudDelay + 's');
        cloudImage.css("animation-timing-function", 'linear');
    }
    function updateHourly(hourly){
        var hourlyChart = $('#hourlyTemps');
        var hourlyPoints = hourlyChart[0].points;
        var max = getMaxTemp(hourly);
        var min = getMinTemp(hourly);
        var range = max-min;
        var multiplier = 100/range;
        var maxminMessage = "MAX:"+max+ " MIN:"+min; 
        for(var i = 0; i<12; i++){ 
            var hourTemp = Math.floor(hourly[i].temperature);
            var hourTempforChart = (max - hourTemp) * multiplier;
            hourlyPoints[i].y = hourTempforChart;
            hourlyPoints[i].x = i*20;
        }
        $("#hourlyMinMax").text(maxminMessage); 
        placeMinMax(); 
    }
    function placeMinMax(){
        var hourlyChartRect = $('#hourlyTemps')[0].getBoundingClientRect();
        var svgChart = $(".chart")[0].getBoundingClientRect();
        var hourlyBot = hourlyChartRect.bottom;
        var svgBot    = svgChart.bottom;
        var diff = svgBot-hourlyBot;
        $('.chart').css("width", hourlyChartRect.width);
        $('#hourlyMinMax').css("top", hourlyBot + (diff/2));
    }
    function getMaxTemp(hourly){
        var max = -99;
        for(var i = 0; i<12; i++){
            var temp = Math.floor(hourly[i].temperature);
            if(temp>max){
                max = temp;
            }
        }
        return max;
    }
    function getMinTemp(hourly){
        var min = 1000;
        for(var i = 0; i<12; i++){
            var temp = Math.floor(hourly[i].temperature);
            if(temp<min){
                min = temp;
            }
        }
        return min;

    }
    function shiftText(today){         
        var canvas = $('#raining')[0];
        var canvas2D = canvas.getContext('2d');
        if(sunIsDown(today))
        {
            $("#time").css("color", "white");
            $("#temperature").css("color", "white");
            $("#hourlyTemps").css("stroke","white");
            $('#hourlyMinMax').css("color", "white");
            canvas2D.strokeStyle = 'rgba(205, 212, 222, 0.5)';
        }
        else
        {
            $("#time").css("color","black");
            $("#temperature").css("color","black");
            $("#hourlyTemps").css("stroke","black");
            $('#hourlyMinMax').css("color", "black");
            canvas2D.strokeStyle = 'rgba(205, 212, 222, 0.5)';
        }
    }
    function updateRain(rainIntense){
        var canvas = $('#raining')[0];
        var canvas2D = canvas.getContext('2d');
        canvas2D.lineWidth = 1;
        canvas2D.lineCap = 'round';
        var rainHeight = window.innerHeight;
        var rainWidth = window.innerWidth;
        rainArray = getRainArray(rainIntense, rainHeight, rainWidth);
        console.log(rainIntense);
        if(rainIntense){
            clearInterval(rainInterval);
            rainInterval = setInterval(placeRain, 10, canvas2D, rainHeight, rainWidth);
        }
        else if(rainInterval)
        {
            clearInterval(rainInterval);
        }
    }
    function getRainArray(rainIntense, rainHeight, rainWidth){
        var rainArrayTemp = [];
        for(var i =0; i < rainIntense; i++){
            rainArrayTemp.push({
                x  : Math.random() * rainWidth,
                y  : Math.random() * rainHeight,
                l  : Math.random() * 1,
                xs : -4 + Math.random() * 4 +2,
                ys : Math.random() * 10 + 10
            });
        }
        return rainArrayTemp;
    }
    function placeRain(canvas, rainHeight, rainWidth){
        canvas.clearRect(0, 0, rainWidth, rainHeight);
        for(var i = 0; i< rainArray.length; i++){
            var rainDroplet = rainArray[i];
            canvas.beginPath();
            canvas.moveTo(rainDroplet.x, rainDroplet.y);
            canvas.lineTo(rainDroplet.x + rainDroplet.l * rainDroplet.xs, rainDroplet.y + rainDroplet.l * rainDroplet.ys);
            canvas.stroke();
        }
        moveRain(rainHeight, rainWidth);
    }
    function moveRain(rainHeight, rainWidth )
    {
        for(var i = 0; i<rainArray.length; i++)
        {
            var rainDroplet = rainArray[i];
            rainDroplet.x += rainDroplet.xs;
            rainDroplet.y += rainDroplet.ys;
            if(rainDroplet.x > rainWidth || rainDroplet.y > rainHeight*2){
                rainDroplet.x = Math.random() * rainWidth;
                rainDroplet.y = -20;
            }
        }
    }
    function updateWind(windSpeedMS){
        windSpeedKH = windSpeedMS * 3.6;
        var beaufortScale = getBeaufort(windSpeedKH); 
        console.log(beaufortScale);
    }
    function getBeaufort(windSpeed){
        if(windSpeed< 1){
            return 0;
        }else if(windSpeed<5){
            return 1;
        }else if(windSpeed<11){
            return 2;
        }else if(windSpeed<19){
            return 3;
        }else if(windSpeed<28){
            return 4;
        }else if(windSpeed<38){
            return 5;
        }else if(windSpeed<49){
            return 6;
        }else if(windSpeed<61){
            return 7;
        }else if(windSpeed<74){
            return 8;
        }else if(windSpeed<88){
            return 9;
        }else if(windSpeed<102){
            return 10;
        }else if(windSpeed<117){
            return 11;
        }else{
            return 12;
        }
    }
});
