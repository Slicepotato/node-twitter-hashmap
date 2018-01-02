var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 2,
        center: new google.maps.LatLng(2.8,-187.3),
        mapTypeId: 'roadmap'
    });
    
    socket.on('twitter-stream', function (data) {
        //Add tweet to the map array.
        var tweetLocation = new google.maps.LatLng(data.lng,data.lat);
        
        var tweetMeta = '<div id="info-content"><h2>' + data.user + '</h2><p><em>on: ' + data.time + '</em></p><p>' + data.text + '</p></div>';
        
        var infoWindow = new google.maps.InfoWindow();
        
        var tweetLocation = new google.maps.LatLng(data.lat, data.lng);
        var marker = new google.maps.Marker({
            position: tweetLocation,
            map: map,
            title: data.user
        });

        //Attach click event to the marker.
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                infoWindow.setContent(tweetMeta);
                infoWindow.open(map, marker);
            });
        })(marker, data);

        /*
        setTimeout(function(){
            marker.setMap(null);
        },5000);
        */
    });
}

var socket = io.connect();
$(document).ready(function(){
    // This listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {
        $('#catch-all').prepend('<li>' + data.user + ' | lat: ' + data.lat + ' - ' + data.lng + '</li>');
        console.log(data);
    });
});