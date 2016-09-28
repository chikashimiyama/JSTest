var sounds = ["noise", "gliss"];
var howlDictionary = {}; // instances of howl class
var circleDictionary = {};
var progress = 0.0;
var start = {"x": 50, "y": 450};
var end = {"x": 450, "y": 50};
var current = {"x":0, "y": 0};

$("document").ready(function(){
	var setupHowl = function( sound ){
		var howl = new Howl({ src: [sound + ".wav"] });
		howl.preload = true;
		return howl;
	};

	var updateColor = function(){
	  	for(var i = 0; i < sounds.length; i++){
	  		if(circleDictionary[sounds[i]].update(current.x,current.y)) changed = true;
	  	}
	};

	var drawCircles =  function(){
		var canvas = $('#myCanvas')[0];
		var ctx = canvas.getContext("2d");
	  	for(var i = 0; i < sounds.length; i++){
	  		circleDictionary[sounds[i]].draw(current.x,current.y);
	  	}
	};

	var drawRoute = function(){
		var canvas = $('#myCanvas')[0];
		var ctx = canvas.getContext("2d");
		ctx.strokeStyle = "#0000FF";
 		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	};

	var drawMe = function(){
		var canvas = $('#myCanvas')[0];
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = "#FF2222";
		ctx.arc(current.x, current.y, 15, 0, 2*Math.PI, true);
		ctx.fill();
	};
	for(var i = 0; i < sounds.length; i++){
		howlDictionary[sounds[i]] = setupHowl(sounds[i]);
		circleDictionary[sounds[i]] = new Circle(100*i+200, 100*i+200, 150+i*25, sounds[i]);
	}
	var clear = function(){
		var canvas = $('#myCanvas')[0];
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,canvas.width, canvas.height);
	};
	var redraw = function(){
		updateColor();
		clear();
		drawCircles();
		drawRoute();
		drawMe();
	};
	var updatePosition = function(){
		var gapX = end.x - start.x;
		var gapY = end.y - start.y;
		current.x = gapX * progress + start.x;
		current.y = gapY * progress + start.y;
	};
  	$('#walk').on('click', function(){
		var timer = setInterval( function(){
    		updatePosition();
    		redraw();
    		progress += 0.005;
    		if(progress > 1.0){
    			clearInterval(timer);
    			progress = 0.0;
    			updatePosition();
    			redraw();
    		}

    	}, 100);
	});

  	drawCircles();
  	drawRoute();
});

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
	getDistance:function(x, y){
		var gapX = (x-this.x);
		var gapY = (y-this.y);
	  	return Math.sqrt(gapX * gapX + gapY * gapY);
	},
	getRelativeDistance: function(x, y){
		var dist = this.getDistance(x, y);
		return 1.0 - (dist / this.radius);
	},
  	isInside:function(px, py){
  		var dist = this.getDistance(px, py);
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
	update:function(x, y){
		var inside = this.isInside(x,y);
		var changed = false;
    	if(inside){
    		this.setHighlight();
    	}else{
    		this.unsetHighlight();
    	}
    	changed = (this.previous != inside);
    	if(changed){
    		if(inside){
    			howlDictionary[this.name].stop();
    			howlDictionary[this.name].play();
    			howlDictionary[this.name].volume(this.getRelativeDistance(x, y));
    		}else{
    			howlDictionary[this.name].stop();
    		}
    	}else{
    		if(inside){
    			var vol = this.getRelativeDistance(x, y);
    			howlDictionary[this.name].volume(vol*vol);
    		}
    	}
    	this.previous = inside;
    	return changed;
	},
  	draw:function(x,y){
    	var canvas = $("#myCanvas")[0];
	    if (canvas.getContext){
	    	var ctx = canvas.getContext('2d');
	    	ctx.beginPath();
	    	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	    	ctx.strokeStyle = this.color;
	    	ctx.stroke();

	    	ctx.beginPath();
	    	ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
	    	ctx.fillStyle = "#888888";
	    	ctx.fill();

	    	if(this.previous){
	    		ctx.strokeStyle= "#0000EE";
	    		ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(x,y);
	    		ctx.stroke();
  				ctx.font = "18px serif";
				var percent = parseInt(100.0 * this.getRelativeDistance(x, y));
	 		 	ctx.fillText("Vol: " + percent + " %", this.x+10, this.y);

	    	}

    	}
  	}
};