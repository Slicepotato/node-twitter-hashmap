var twitter = require('twit');
var config = require('./config');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use('/img',express.static(__dirname + '/public/img'));
app.use('/js',express.static(__dirname + '/public/js'));
app.use('/css',express.static(__dirname + '/public/css'));

//Setup twitter stream api
var twit = new twitter(config);

var hashtags = ['#hirefoodtrucks','#502foodie','#louisvillefood','#louisvillefoodie','#eatthestreet','#eatlouisville','#foodtruck','#tastelouisville','#eatlovelouisville','#HappyNewYear','#NewYear','#NewYearsDay','#WeirdWinterHobbies','#HRX2018','#Trump'];

io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit("hashlist", { hash: hashtags });
    var stream = twit.stream('statuses/filter', { track: hashtags, language: 'en' }); // get is the function to search the tweet which three paramaters 'search/tweets',params and a callback function.
    stream.on('tweet', function (tweet) {
       if(tweet.coordinates != null) {
            var outputPoint = {"user": tweet.user.screen_name, "time": tweet.created_at, "text": tweet.text, "lat": tweet.coordinates.coordinates[0],"lng": tweet.coordinates.coordinates[1]};
            socket.emit("twitter-stream", outputPoint);

            console.log(outputPoint);
        }
        /* console.log(tweet); */
    });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
