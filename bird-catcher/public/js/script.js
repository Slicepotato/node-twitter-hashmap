var map;
var mc;
var markers = [];
var socket = io.connect('http://hashmap.derbycitydesignlab.com:3000');

function initMap() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(0.0,0.0),
        mapTypeId: 'roadmap'
    }

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function addMarker(loc){
    var tweetLocation = new google.maps.LatLng(loc.lng,loc.lat);
    var marker = new google.maps.Marker({
        position: tweetLocation,
        map: map,
        animation: google.maps.Animation.DROP,
        title: loc.user
    });

    var tweetMeta = '<div id="info-content"><h2>' + loc.user + '</h2><p><em>on: ' + loc.time + '</em></p><p>' + loc.text + '</p></div>';

    var infoWindow = new google.maps.InfoWindow();

    marker.addListener("click", function() {
        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
        infoWindow.setContent(tweetMeta);
        infoWindow.open(map, this);
    });

    var options = {
        gridSize: 50,
        maxZoom: 15,
        imagePath: 'img/m'
    };
    // mc = new MarkerClusterer(map, markers, options);
    // mc.addMarker(markers, true)

    // return marker;
}

$(document).ready(function(){
    socket.on('twitter-stream', function (data) {
        $('#catch-all').prepend('<li>' + data.user + ' ||  lat: ' + data.lat + ' - lng:' + data.lng + '</li>');
        console.log(data);

        addMarker(data);
    });

    socket.on('hashlist', function(data) {
        for( var i = 0, l = data.hash.length; i < l; i++ )
        {
            $('#hash-list').append('<li><span>' + data.hash[i] + '</span></li>');
        }
    });
});
