
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpa2FzaGltaXlhbWEiLCJhIjoiY2l0azhzeG5nMDA0ZTJvcGRuNHhjc3dpZCJ9.su83cgk0f9cDWpzworwofQ';
var map = new mapboxgl.Map({
    container: 'map',
	center: [23.719243, 37.957958],
	zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v9',

});

var direction = 0, manual = false, speed = 0.01;

// global
var radius = 20;
var pos = [23.719243, 37.957958];
function pointOnCircle(angle) {
	pos = [pos[0] - 0.000005, pos[1] - 0.000005];
    return {
        "type": "Point",
        "coordinates": pos
    };
}

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
	var squareCoodonate = function(longitude, latitude, size){
		var halfSize = size / 2;
		return [[longitude-halfSize, latitude+halfSize], 
				[longitude+halfSize, latitude+halfSize],
				[longitude+halfSize, latitude-halfSize],
				[longitude-halfSize, latitude-halfSize]];
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

    map.addSource("point",{
    	"type": "geojson",
    	"data": pointOnCircle(0)
    });

    map.addLayer({
        "id": "point-layer",
        "source": "point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#FF0000"
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


    function animateMarker(timestamp) {
        // Update the data to a new position based on the animation timestamp. The
        // divisor in the expression `timestamp / 1000` controls the animation speed.
        map.getSource('point').setData(pointOnCircle(timestamp / 1000));

        // Request the next frame of the animation.
        requestAnimationFrame(animateMarker);
    }

    // Start the animation.
    animateMarker(0);
});
 
$("document").ready(function(){



});