var howlDictionary = {}; // instances of howl class
var sounds = ["noise", "gliss"];

$("document").ready(function(){

	var setupHowl = function( sound ){
		var howl = new Howl({ src: [sound + ".wav"] });
		howl.preload = true;
		return howl;
	};
	var createFadeInFunc = function(index){
		return function() {
			var soundName = sounds[index];
			var time = parseFloat($("#fadeinTime-"+soundName).val());
			howlDictionary[soundName].stop();
			howlDictionary[soundName].play();
			howlDictionary[soundName].fade(0, 1, time*1000);
		}
	};
	var createFadeOutFunc = function(index){
		return function() { 
			var soundName = sounds[index];
			var time = parseFloat($("#fadeoutTime-"+soundName).val());
			howlDictionary[soundName].fade(1, 0, time*1000);
		}
	};

	for(var i = 0; i < sounds.length; i++){
		howlDictionary[sounds[i]] = setupHowl(sounds[i]);
		$("#fadein-"+sounds[i] ).click(createFadeInFunc(i))
		$("#fadeout-"+sounds[i] ).click(createFadeOutFunc(i));
	}
})



