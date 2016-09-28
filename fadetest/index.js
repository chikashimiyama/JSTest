
function setupSoundStream(key) {
  elementArray[key] = createElement(key+".wav");
  var source = audioCtx.createMediaElementSource(elementArray[key]);
  gainNodeArray[key] = audioCtx.createGain();
  source.connect(gainNodeArray[key]);
  gainNodeArray[key].connect(audioCtx.destination);
  gainNodeArray[key].gain.value = 0.0;
}

function createElement(filePath){
  var audio = new Audio();
  audio.src = filePath;
  audio.control = false;
  audio.autoplay = false;
  audio.load();
  return audio;
}

function fadein(key) {

  var fadeInTime = parseInt(document.getElementById("fadeInTime-"+key).value);
  console.log("fadein " + key + " time: " + fadeInTime);
  elementArray[key].currentTime = 0.0;
  elementArray[key].play();
  gainNodeArray[key].gain.linearRampToValueAtTime(1, audioCtx.currentTime+fadeInTime);
}

function fadeout(key) {
  var fadeOutTime = parseInt(document.getElementById("fadeOutTime-"+key).value);
  console.log("fadeout " + key + " time: " + fadeOutTime);
  gainNodeArray[key].gain.linearRampToValueAtTime(0.0, audioCtx.currentTime+fadeOutTime);
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var elementArray = {};
var gainNodeArray = {};
setupSoundStream("noise");
setupSoundStream("gliss");

document.getElementById("fadein-noise").addEventListener("click", function(){ fadein("noise");});
document.getElementById("fadeout-noise").addEventListener("click", function(){  fadeout("noise");});
document.getElementById("fadein-gliss").addEventListener("click", function(){ fadein("gliss");});
document.getElementById("fadeout-gliss").addEventListener("click", function(){  fadeout("gliss");});
