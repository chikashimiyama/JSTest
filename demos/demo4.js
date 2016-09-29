
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpa2FzaGltaXlhbWEiLCJhIjoiY2l0azhzeG5nMDA0ZTJvcGRuNHhjc3dpZCJ9.su83cgk0f9cDWpzworwofQ';
var map = new mapboxgl.Map({
    container: 'map',
	center: [23.719243, 37.957958],
	zoom: 15,
    style: 'mapbox://styles/mapbox/streets-v9'
});
 
$("document").ready(function(){
	$('#above').on('click', function(){
		map.setStyle('mapbox://styles/mapbox/streets-v9');
	});
	$('#below').on('click', function(){
		map.setStyle('mapbox://styles/mapbox/dark-v9');
	});

});