
var sounds = ["noise","gliss","drums"];
var howlDictionary = {}; // instances of howl class

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpa2FzaGltaXlhbWEiLCJhIjoiY2l0azhzeG5nMDA0ZTJvcGRuNHhjc3dpZCJ9.su83cgk0f9cDWpzworwofQ';

var map = new mapboxgl.Map({
    container: 'map',
	center: [23.719243, 37.957958],
	zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v9',

});

var direction = 0, manual = false, speed = 0.0;

// global
var radius = 20;
var pos = [23.720743, 37.959458];
function pointOnCircle(angle) {
	pos = [pos[0] - 0.0000035, pos[1] - 0.0000025];
    return {
        "type": "Point",
        "coordinates": pos
    };
}

map.on('load', function () {
    var setupHowl = function( sound ){
        var howl = new Howl({ src: [sound + ".wav"] });
        howl.preload = true;
        return howl;
    };
	var createCircleFeature = function(longitude, latitude, radius, sound){
        var center = {
            "type": "Feature",
            "properties": {
                "marker-color": "#0f0"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            }
        };

        var circle = turf.circle(center, radius, 36);
        circle.radius = radius;
        circle.center = [longitude, latitude];
        circle.previous = false;
        circle.sound = sound;
		return circle;
	};
    var createPointFeature = function(coordinates){
        return {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": coordinates
            }
        };
    };

	var squareCoodonate = function(longitude, latitude, size){
		var halfSize = size / 2;
		return [[longitude-halfSize, latitude+halfSize], 
				[longitude+halfSize, latitude+halfSize],
				[longitude+halfSize, latitude-halfSize],
				[longitude-halfSize, latitude-halfSize]];
	};


    for(var i = 0; i < sounds.length; i++){
        howlDictionary[sounds[i]] = setupHowl(sounds[i]);
    }

    map.addSource("circles", {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features" : [
                createCircleFeature(23.719243, 37.957958, 0.1, "noise"),
                createCircleFeature(23.71743, 37.956958, 0.15, "gliss"),
                createCircleFeature(23.71543, 37.955658, 0.2, "drums")
            ]
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
        map.getSource('point').setData(pointOnCircle(timestamp / 1000));
        var currentCoordinate = map.getSource('point')._data.coordinates;
        var circleFeatures = map.getSource('circles')._data.features;
        for(var i = 0; i < circleFeatures.length; i++){
            var from = createPointFeature(currentCoordinate);
            var to = createPointFeature(circleFeatures[i].center);
            var distance = turf.distance(from, to);
            var inside = distance < circleFeatures[i].radius;
            var changed = circleFeatures[i].previous != inside;
            var soundName = circleFeatures[i].sound;
            if(changed){
                if(inside){
                    //console.log(soundName + "start");
                    howlDictionary[soundName].stop();
                    howlDictionary[soundName].play();
                    howlDictionary[soundName].volume(0.0);
                }else{
                    console.log(soundName + "stop");
                    howlDictionary[soundName].stop();
                }
            }else{
                if(inside){
                    var vol = 1.0-(distance/circleFeatures[i].radius);
                    //console.log(soundName + "vol: " +vol*vol);
                    howlDictionary[soundName].volume(vol);
                }
            }
            circleFeatures[i].previous = inside;
        }

        requestAnimationFrame(animateMarker);//recursive
    }

    animateMarker(0);
});
 
$("document").ready(function(){



});