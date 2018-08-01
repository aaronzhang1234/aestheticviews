$(document).ready(() =>{
  var baseURL = "https://hacker-news.firebaseio.com/v0/";  
  console.log("boof");
  var biewRL = baseURL+"topstories.json?print=pretty";
  console.log(biewRL);
  $.getJSON(biewRL, function(data){
      for(var i =0; i<10; i++){
          var piewRL = baseURL+"item/"+data[i]+".json?print=pretty";
          $.getJSON(piewRL,function(bata){
              console.log(bata.title);
          });
      }
  });
});
