
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpa2FzaGltaXlhbWEiLCJhIjoiY2l0azhzeG5nMDA0ZTJvcGRuNHhjc3dpZCJ9.su83cgk0f9cDWpzworwofQ';
var map = new mapboxgl.Map({
    container: 'map',
	center: [23.719243, 37.957958],
	zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v9',

});



map.on('load', function () {
	var createCircle = function(longitude, latitude, radius){
		var result = [];
		for(i = 0; i < 36; i++){
			var angle = Math.PI / 18 * i;
			var lon = Math.cos(angle) * radius + longitude;
			var lat = Math.sin(angle) * radius + latitude;
			result.push([lon,lat]);
		}
		return result;
	};

    map.addSource("circles", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features" : [{
                "type": "Feature",
	            "geometry": {
	                "type": "Polygon",
	                "coordinates": [createCircle(23.719243, 37.957958, 0.001)]
	            },
	        },{
	            "type": "Feature",
	            "geometry": {
	                "type": "Polygon",
	                "coordinates": [createCircle(23.71543, 37.957658, 0.0015)]
	            }
        	},{
	            "type": "Feature",
	            "geometry": {
	                "type": "Polygon",
	                "coordinates": [createCircle(23.71543, 37.955658, 0.001)]
	            }
        	}]
        }
    });

    map.addLayer({
        "id": "circle-layer",
        "type": "fill",
        "source": "circles",
        "layout": {},
        "paint": {
            'fill-color': '#088',
            'fill-opacity': 0.3
        }
    });
});
 
$("document").ready(function(){



});