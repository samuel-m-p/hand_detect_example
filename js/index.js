// In this case, We set width 320, and the height will be computed based on the input stream.
let width = 320;
let height = 0;

// whether streaming video from the camera.
let streaming = false;

let video = document.getElementById("video");
let stream = null;
let vc = null;
let utils = new Utils('errorMessage'); //use utils class
let faceCascadeFile = 'mano_abierta1.xml'; // path to xml
let handCascade = null;


let lastFilter = '';
let src = null;
let gray = null;
//let handCascade = null;
let dstC1 = null;
let flipped = null;
let canvasHandPos = null;

let handPos = {
	x:0,
	y:0,
	width:0,
	height:0,
};

let isHover = ""; //indica el boton sobre el que esta el raton
let isHandDetected = 0; //indica el numero de frames en los que se ha detectado mano


let timeClick = 2;
var clickTimer = null;
let timeIddle = 1;
var iddleTimer = null;
var lastHandPos = {x: -1, y: -1};
var initialHover ="";
var mouseState = "";


function startCamera() {
  if (streaming) return;
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(s) {
    stream = s;
    video.srcObject = s;
    video.play();
  })
    .catch(function(err) {
    console.log("An error occured! " + err);
  });

  video.addEventListener("canplay", function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute("width", width);
      video.setAttribute("height", height);
      streaming = true;
      vc = new cv.VideoCapture(video);
    }
    startVideoProcessing();
  }, false);
}


function startVideoProcessing() {
  if (!streaming) { console.warn("Please startup your webcam"); return; }
  stopVideoProcessing();
  src = new cv.Mat(height, width, cv.CV_8UC4);
  flipped = new cv.Mat(height, width, cv.CV_8UC4);
  gray = new cv.Mat(height, width, cv.CV_8UC1);
  //handCascade = new cv.CascadeClassifier();
  canvasHandPos = new cv.Point(-1,-1);


  //retval	=	cv.CascadeClassifier.empty(		);
  
  requestAnimationFrame(processVideo);
}


function checkHandPos(){
	if(initialHover == isHover)
		document.getElementById(isHover).click();
	clickTimer = null;
}

function resetTimers(){
	if(clickTimer!=null)
	{
		window.clearTimeout(clickTimer);
		clickTimer = null;
	}
	iddleTimer = null;
}

function detect() {
//	let src = cv.imread('canvasInput');
	//let dstC1 = src.clone();
	canvasHandPos.x = -1;
	canvasHandPos.y = -1;	
	
	if(handCascade!=null){
    cv.cvtColor(flipped, gray, cv.COLOR_RGBA2GRAY, 0);
	let hands = new cv.RectVector();
	//let eyes = new cv.RectVector();
	//let handCascade = new cv.CascadeClassifier();
	//let eyeCascade = new cv.CascadeClassifier();
	// load pre-trained classifiers
	//handCascade.load('haarcascade_frontalface_default.xml');
	//eyeCascade.load('haarcascade_eye.xml');
	// detect hands
	let msize = new cv.Size(0, 0);
	
	handCascade.detectMultiScale(gray, hands, 1.1, 3, 0, msize, msize);
	
	//console.log(hands.size());
	//Cambiar el puntero del mouse
	if(hands.size() > 0)
	{
		if(iddleTimer!=null)
		{
			window.clearTimeout(iddleTimer);
			iddleTimer = null;
		}
		if (clickTimer == null) {
			clickTimer = window.setTimeout(checkHandPos, 1000 * timeClick);
			initialHover = isHover;
			//console.log(lastHandPos.x);
		}
		if(mouseState != "HAND_DETECT"){
			console.log("detected");
			changeMouseIcon("HAND_DETECT");
		}
	}
	else if(hands.size() == 0)
	{
		if (iddleTimer == null) {
			iddleTimer = window.setTimeout(resetTimers, 1000 * timeIddle);
		}
		if( mouseState != "IDDLE")
		{
			changeMouseIcon("");
			console.log("iddle");
		}
	}
	
	
	for (let i = 0; i < hands.size(); ++i) {
		let point1 = new cv.Point(hands.get(i).x, hands.get(i).y);
		let point2 = new cv.Point(hands.get(i).x + hands.get(i).width,
								  hands.get(i).y + hands.get(i).height);
		cv.rectangle(flipped, point1, point2, [255, 0, 0, 255]);
		
		//Devolvemos coordenadas x y de la mano (en el centro del rectangulo)
		//Nos quedamos solo con la primera mano encontrada en el array
		//canvasHandPos.x = Math.round(hands.get(0).x + hands.get(0).width/2);
		//canvasHandPos.y = Math.round(hands.get(0).y + hands.get(0).height/2);
		handPos.x= hands.get(0).x;
		handPos.y= hands.get(0).y;
		handPos.width= hands.get(0).width;
		handPos.height= hands.get(0).height;
		
	}
	
	hands.delete(); 
	}


}


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.ieRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
var then = Date.now() / 1000;  // get time in seconds


function processVideo() {
	if (streaming) {
		  
  vc.read(src);

  //Rotar horizontalmente la imagen capturada 
  cv.flip(src, flipped, 1 );
  //result = detect(src);
  detect();
  
  cv.imshow("fullviewport", flipped);
  
  
  //Calcular los FPS********************
  
  var now = Date.now() / 1000;  // get time in seconds
    
    // compute time since last frame
    var elapsedTime = now - then;
    then = now;
    
    // compute fps
    var fps = 1 / elapsedTime;
 //Calcular los FPS********************
  
  
  //Mover puntero
  if(mouseState == "HAND_DETECT")
	moveMouse();

  //Comprobar estado del puntero
  checkMouse();	


  	}
	
  requestAnimationFrame(processVideo);

}

 function checkMouse(){
	 var buttons = document.getElementsByClassName('button');
	 var theThingRect = theThing.getBoundingClientRect();
	 
	 //Comprobar posicion y cambiar aspecto
	 for (let i = 0; i < buttons.length; ++i) {
		 var domRect = buttons[i].getBoundingClientRect();
		
		 if(theThingRect.left > domRect.left && theThingRect.right < domRect.right && theThingRect.bottom < domRect.bottom && theThingRect.top > domRect.top )
		 {
			 buttons[i].style.color = "#000000";
			 buttons[i].style.backgroundColor = "#FFFFFF";
			 isHover = buttons[i].id;
			 break;
		 }else{
			 buttons[i].style.color = "#FFFFFF";
			 buttons[i].style.backgroundColor = "";
			 isHover = "";
		 }
	 }
	 console.log(isHover);
	  
}



function stopVideoProcessing() {
  if (src != null && !src.isDeleted()) src.delete();
  if (gray != null && !gray.isDeleted()) gray.delete();
  //if (handCascade != null && !handCascade.isDeleted()) handCascade.delete();
  if (dstC1 != null && !dstC1.isDeleted()) dstC1.delete();
  if (canvasHandPos != null && !canvasHandPos.isDeleted()) canvasHandPos.delete();
  if (flipped != null && !flipped.isDeleted()) flipped.delete();
  if (utils != null) delete utils;

}

function stopCamera() {
  if (!streaming) return;
  stopVideoProcessing();
  document.getElementById("canvasOutput").getContext("2d").clearRect(0, 0, width, height);
  video.pause();
  video.srcObject=null;
  stream.getVideoTracks()[0].stop();
  streaming = false;
}



function opencvIsReady() {
  console.log('OpenCV.js is ready');
  
//  initUI();
  handCascade = new cv.CascadeClassifier();
// use createFileFromUrl to "pre-build" the xml
utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
    handCascade.load(faceCascadeFile); // in the callback, load the cascade from file 
});
  
  startCamera();

// Get the canvas element form the page
var canvas1 = document.getElementById("fullviewport");
 
/* Rresize the canvas to occupy the full page, 
   by getting the widow width and height and setting it to canvas*/
 
canvas1.width  = window.innerWidth;
canvas1.height = window.innerHeight;


}


//Mouse related functions

var theThing = document.querySelector("#thing");


function moveMouse() {
	//Tamano del viewport
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	//Relacion aspecto viewport - canvas
	arW = w / width;
	arH = h / height;
	
	//mouseX = arW * canvasHandPos.x;
	//mouseY = arH * canvasHandPos.y;
	
			// handPos.x=hands.get(0).x;
		// handPos.y=hands.get(0).y;
		// handPos.width=hands.get(0).width;
		// handPos.height=hands.get(0).height;
		
	mouseX = arW * Math.round(handPos.x + handPos.width/2);
	mouseY = arH * Math.round(handPos.y + handPos.height/2);
			 console.log(mouseX);
		 console.log(mouseY);
	
	
	var width_offset = Math.round(theThing.offsetWidth);
	var height_offset = Math.round(theThing.offsetHeight);

	mouseX_centered = mouseX - Math.round(width_offset/2);
	mouseY_centered = mouseY - Math.round(width_offset/2);

	
	theThing.style.left = mouseX_centered + "px";
    theThing.style.top = mouseY_centered + "px";
	
	if(canvasHandPos.x > 0){
		// console.log(w);
		// console.log(h);
		// console.log(canvasHandPos.x);
		// console.log(canvasHandPos.y);
	}
}

function changeMouseIcon(state){
	switch(state){
        case "HAND_DETECT":
            document.getElementById("thing").src="images/puntero_verde.png";
			mouseState = "HAND_DETECT";
            break;
        case "CLICK":
            document.getElementById("thing").src="images/puntero_azul.png";
			mouseState = "CLICK";
            break;
        default:
            document.getElementById("thing").src="images/puntero_rojo.png";
			mouseState = "IDDLE";
    }
	
}
