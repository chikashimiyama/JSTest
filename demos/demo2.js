var sounds = ["noise", "gliss"];
var howlDictionary = {}; // instances of howl class
var circleDictionary = {};

$("document").ready(function(){
	var setupHowl = function( sound ){
		var howl = new Howl({ src: [sound + ".wav"] });
		howl.preload = true;
		return howl;
	};

	var updateColor = function(x, y){
	  	for(var i = 0; i < sounds.length; i++){
	  		if(circleDictionary[sounds[i]].update(x,y)) changed = true;
	  	}
	};

	var drawCircles =  function(x, y){
		var canvas = $('#myCanvas')[0];
		var ctx = canvas.getContext("2d");
	  	ctx.clearRect(0,0,canvas.width, canvas.height);
	  	for(var i = 0; i < sounds.length; i++){
	  		circleDictionary[sounds[i]].draw(x,y);
	  	}
	};

	for(var i = 0; i < sounds.length; i++){
		howlDictionary[sounds[i]] = setupHowl(sounds[i]);
		circleDictionary[sounds[i]] = new Circle(100*i+200, 100*i+200, 150+i*25, sounds[i]);
	}

  	$('#myCanvas').on('mousemove', function(e){
  		var rect = $('#myCanvas')[0].getBoundingClientRect();
		var x = parseInt(event.clientX - rect.left);
		var y = parseInt(event.clientY - rect.top);
		var coor = "Coordinates: (" + x + "," + y + ")";
		$("#coordinates").text(coor);
		updateColor(x,y);
		drawCircles(x,y);
	});
  	drawCircles();
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
	    	var circle = new Path2D();
	    	circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	    	ctx.strokeStyle = this.color;
	    	ctx.stroke(circle);

	    	var innerCircle = new Path2D();
	    	innerCircle.arc(this.x, this.y, 5, 0, 2 * Math.PI);
	    	ctx.fill(innerCircle);

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