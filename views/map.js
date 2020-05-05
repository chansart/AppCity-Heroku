// Source : http://vdw.staytuned.gr/get-coordinates-of-google-map-draggable-marker-using-google-maps-javascript-api-v3/

// configuration
var myZoom = 12;
var myMarkerIsDraggable = true;
var myCoordsLenght = 6;
var defaultLat = 50.669135;
var defaultLng = 4.610090;

// creates the map
// zooms
// centers the map
// sets the map's type 
var map = new google.maps.Map(document.getElementById('map-canvas'), {
	zoom: myZoom,
	center: new google.maps.LatLng(defaultLat, defaultLng),
	mapTypeId: google.maps.MapTypeId.ROADMAP
});

// creates a draggable marker to the given coords
var myMarker = new google.maps.Marker({
	position: new google.maps.LatLng(defaultLat, defaultLng),
	draggable: myMarkerIsDraggable
});

// adds a listener to the marker
// gets the coords when drag event ends
// then updates the input with the new coords
google.maps.event.addListener(myMarker, 'dragend', function (evt) {
	document.getElementById('latitude').value = evt.latLng.lat().toFixed(myCoordsLenght);
	document.getElementById('longitude').value = evt.latLng.lng().toFixed(myCoordsLenght);
});

// centers the map on markers coords
map.setCenter(myMarker.position);

// adds the marker on the map
myMarker.setMap(map);