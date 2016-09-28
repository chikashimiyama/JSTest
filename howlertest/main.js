howlDictionary = {};
soundDictionary = {};
howlDictionary["noise"] = setupHowl("noise");
howlDictionary["gliss"] = setupHowl("gliss");

function setupHowl( sound ){
	var howl = new Howl({ src: [sound + ".wav"] });
	howl.preload = true;
	return howl;
}

function fadein( sound ){
	soundDictionary[sound] = howlDictionary[sound].stop();
	soundDictionary[sound] = howlDictionary[sound].play();
	howlDictionary[sound].fade(0, 1, 3000);
}

function fadeout( sound ){

	howlDictionary[sound].fade(1, 0, 3000, soundDictionary[sound]);

	// dosen't work
	soundDictionary[sound].onfade = function(){
		soundDictionary[sound] = howlDictionary[sound].stop();
	};
}