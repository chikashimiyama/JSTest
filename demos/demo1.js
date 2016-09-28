var sounds = ["noise", "gliss"];
var howlDictionary = {}; // instances of howl class
var circleDictionary = {};

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

	var rangedRandom = function rangedRandom(min, max){
		var range = max - min; 
		return Math.random() * range + min;
	};

	for(var i = 0; i < sounds.length; i++){
		howlDictionary[sounds[i]] = setupHowl(sounds[i]);
		circleDictionary[sounds[i]] = new Circle(100*i+200, 100*i+200, 150+i*50, sounds[i]);
		$("#fadein-"+sounds[i] ).click(createFadeInFunc(i));
		$("#fadeout-"+sounds[i] ).click(createFadeOutFunc(i));
	}

  	$('#myCanvas').on('mousemove', function(e){
  		var rect = $('#myCanvas')[0].getBoundingClientRect();
		var x = parseInt(event.clientX - rect.left);
		var y = parseInt(event.clientY - rect.top);
		var coor = "Coordinates: (" + x + "," + y + ")";
		$("#coordinates").text(coor);

		var change = updateColor(x, y);
		if(change){
			drawCircles();
		}
	});
  	drawCircles();
})

function Circle(x, y, radius, name) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "#000000";
    this.previous = false;
    this.name = name;
}

Circle.prototype = {
	constructor: Circle,
  	isInside:function(px, py){
    	var gapX = (px-this.x);
		var gapY = (py-this.y);
	  	var dist = Math.sqrt(gapX * gapX + gapY * gapY);
    	return dist < this.radius;
	},
	setRadius:function(radius){
    	this.radius = radius;
	},
	setHighlight:function(){
    	this.color = "#FF0000";
	},
	unsetHighlight:function(){
    	this.color = "#000000";
	},
	updateColor:function(px, py){
		var inside = this.isInside(px,py);
		var changed = false;
    	inside ? this.setHighlight() : this.unsetHighlight();
    	changed = (this.previous != inside);
    	if(changed){
    		var elementName = inside ? "#fadein-"+this.name : "#fadeout-"+this.name;
    		$(elementName).trigger('click');
    	}
    	this.previous = inside;
    	return changed;
	},
  	draw:function(){
    	var canvas = $("#myCanvas")[0];
	    if (canvas.getContext){
	    	var ctx = canvas.getContext('2d');
	    	var circle = new Path2D();
	    	circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	    	ctx.strokeStyle = this.color;
	    	ctx.stroke(circle);
    	}
  	}
}

function updateColor(x, y){
	var changed = false;
  	for(var i = 0; i < sounds.length; i++){
  		if(circleDictionary[sounds[i]].updateColor(x,y)) changed = true;
  	}
  	return changed;
}

function drawCircles(){
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext("2d");
  	ctx.clearRect(0,0,canvas.width, canvas.height);
  	for(var i = 0; i < sounds.length; i++){
  		circleDictionary[sounds[i]].draw();
  	}
}




