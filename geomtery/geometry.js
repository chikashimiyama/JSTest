function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "#000000";
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
    if(this.isInside(px,py)){this.setHighlight();}else{this.unsetHighlight();}
  },
  draw:function(){
    var canvas = document.getElementById('canvas');
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');
      var circle = new Path2D();
      circle.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = this.color;
      ctx.stroke(circle);
    }
  }
}

function initCircles(){
  for(var i = 0; i < 3; i++){
    circles.push(new Circle(rangedRandom(100, 400), rangedRandom(100, 400), rangedRandom(10,200)));
  }
}
function rangedRandom(min, max){
  var range = max - min;
  return Math.random() * range + min;
}

function updateColor(x, y){
  for(var i = 0; i < 3; i++){circles[i].updateColor(x, y);}
}

function drawCircles(){
  for(var i = 0; i < 3; i++){circles[i].draw();}
}

var circles = [];
initCircles();
drawCircles();

document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
  var x = event.clientX;
  var y = event.clientY;
  var coor = "Coordinates: (" + x + "," + y + ")";
  document.getElementById("demo").innerHTML = coor;
  updateColor(x, y);
  drawCircles();
}