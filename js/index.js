var isHover = ""; //indica el boton sobre el que esta el raton
var timeClick = 2; //Indica el tiempo (en seg) necesario para activar un click
var clickTimer = null;
var timeIddle = 1; //indica el tiempo sin detectar mano para resetear la deteccion de clicl
var iddleTimer = null;
var initialHover ="";
var mouseState = "";
 

// Tamano de la captura. Ancho a 320, y el alto se calcula a partir del stream de entrada.
var width = 320;
var height = 0;

// variables para video
var streaming = false;
var video = document.getElementById("video");
var stream = null;
var vc = null;
var utils = new Utils('errorMessage'); //use utils class
var faceCascadeFile = 'mano_abierta1.xml'; // path al xml del detector
var handCascade = null; //haarcascade
var src = null;//imagenes opencv empleadas
var gray = null;
var flipped = null;

var handPos = { //posicion de la mano detectada
	x:0,
	y:0,
	width:0,
	height:0,
};


/**
 * Callback cuando se hace click en 'button1'.
 * Oculta 'button1' y muestra 'regular_button'.
 */
function button1_click(){
	var el = document.getElementById("button1").style.display = "none";
	var el1 = document.getElementById("regular_button").style.display = "block";
}
/**
 * Callback cuando se hace click en 'regular_button'.
 * Oculta 'regular_button' y muestra 'button1'.
 */
function regular_button_click(){
	var el = document.getElementById("button1").style.display = "block";
	var el1 = document.getElementById("regular_button").style.display = "none";
}

/**
 * Inicializa la captura de video
 */
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
			//el alto de la captura se calcula a partir del stream de entrada y el ancho establecido
      height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute("width", width);
      video.setAttribute("height", height);
      streaming = true;
      vc = new cv.VideoCapture(video);
    }
    startVideoProcessing();
  }, false);
}

/**
 * Inicializa el procesamiento. 
 * stopVideoProcessing se asegura de eliminar objetos existentes.
 * Inicializa los objetos de OpenCV necesarios y llama a requestAnimationFrame que 
 * solicite al navegador que programe el repintado de la ventana para el próximo ciclo. 
 * Acepta como argumento una función a la que llamar antes de efectuar el repintado.
 */
function startVideoProcessing() {
  if (!streaming) { console.warn("Please startup your webcam"); return; }
  stopVideoProcessing();
  src = new cv.Mat(height, width, cv.CV_8UC4);
  flipped = new cv.Mat(height, width, cv.CV_8UC4);
  gray = new cv.Mat(height, width, cv.CV_8UC1);
  requestAnimationFrame(processVideo);
}

/**
 * Funcion que salta al terminar el temporizador de click.
 * Comprueba que el raton este encima del mismo elemento que al comenzar el temporizador.
 * Si lo está, ejecuta click en ese elemento.
 */
function checkClick(){
	var elemHoverId = document.getElementById(isHover);
	if(initialHover == isHover){
		if(elemHoverId != null && elemHoverId.style.display != "none"){
			elemHoverId.click();
		}
	}
	clickTimer = null;
}

/**
 * Funcion que salta al terminar el temporizador de mano no detectada.
 * Si no se detecta mano durante 'timeIddle' (segundos) resetea los temporizadores.
 */
function resetTimers(){
	if(clickTimer!=null)
	{
		window.clearTimeout(clickTimer);
		clickTimer = null;
	}
	iddleTimer = null;
}

/**
 * Funcion de deteccion de mano en imagen con Opencv. 
 * handCascade.detectMultiScale busca mano en la imagen y almacena las encontradas en el vector 'hands'.
 * Si hay mano se almacena la posicion y tamano de la primera encontrada en 'handPos', se activa el temporizador de click
 * y se cambia el estado del raton a "HAND_DETECT" y el icono del raton a verde si no lo estaba.
 * Si no se detecta, activa el temporizador de 'iddle', y se cambia el estado del raton a "IDDLE" y el icono del raton a rojo.
 */
function detect() {

	if(handCascade!=null){
		cv.cvtColor(flipped, gray, cv.COLOR_RGBA2GRAY, 0);
		
		var hands = new cv.RectVector();

		// detect hands
		var msize = new cv.Size(0, 0);

		handCascade.detectMultiScale(gray, hands, 1.1, 3, 0, msize, msize);

		//console.log(hands.size());
		//Cambiar el puntero del mouse
		if(hands.size() > 0){
			//Devolvemos coordenadas x y de la mano (en el centro del rectangulo)
			//Nos quedamos solo con la primera mano encontrada en el array
			handPos.x= hands.get(0).x;
			handPos.y= hands.get(0).y;
			handPos.width= hands.get(0).width;
			handPos.height= hands.get(0).height;
			
			if(iddleTimer!=null){
				window.clearTimeout(iddleTimer);
				iddleTimer = null;
			}
			if (clickTimer == null){
				clickTimer = window.setTimeout(checkClick, 1000 * timeClick);
				initialHover = isHover;
			}
			//modificar el estado del raton
			mouseState = "HAND_DETECT";

		}
		else if(hands.size() == 0){
			if (iddleTimer == null){
				iddleTimer = window.setTimeout(resetTimers, 1000 * timeIddle);
			}
			//modificar el estado del raton
			mouseState = "IDDLE";
		}

		// //Dibuja un rectangulo encima de todas las manos encontradas
		// for (var i = 0; i < hands.size(); ++i) {
			// var point1 = new cv.Point(hands.get(i).x, hands.get(i).y);
			// var point2 = new cv.Point(hands.get(i).x + hands.get(i).width,
										// hands.get(i).y + hands.get(i).height);
			// cv.rectangle(flipped, point1, point2, [255, 0, 0, 255]);
		// }

		hands.delete(); 
	}
}

/**
 * Bucle de procesamiento de video.
 * En cada frame de procesamiento: 
 * 			1- se lee una imagen de video en "src".
 *			2- se voltea horizontalmente (efecto espejo) con "cv.flip" y se almacena en "flipped"
 *			3- se llama a la funcion de deteccion de manos sobre la imagen volteada
 *			4- si se ha detectado mano se mueve el raton
 *			5- se comprueba el estado del raton por si hay que cambiar de icono o 
 */
function processVideo() {
	if (streaming) {
			
		//Leer frame capturado y almacenarlo en 'src'
		vc.read(src);

		//Rotar horizontalmente la imagen capturada y almacenarla en 'flipped'
		cv.flip(src, flipped, 1 );
		
		//Detectar manos en la imagen
		detect();

		//Si se ha detectado mano, mover puntero
		if(mouseState == "HAND_DETECT")
			moveMouse();

		//Comprobar estado del raton
		checkMouse();	
		
		//Mostrar la imagen en el canvas
		cv.imshow("fullviewport", flipped);
	}

	requestAnimationFrame(processVideo);
}

/**
 * liberar memoria
 */
function stopVideoProcessing() {
  if (src != null && !src.isDeleted()) src.delete();
  if (gray != null && !gray.isDeleted()) gray.delete();
  //if (handCascade != null && !handCascade.isDeleted()) handCascade.delete();
  if (flipped != null && !flipped.isDeleted()) flipped.delete();
  if (utils != null) delete utils;
}

/**
 * Se llama cuando termina de cargar opencv.js (Ver index.html).
 * Al ser una libreria grande se carga de forma asincrona, permitiendo que se muestren
 * el resto de elementos
 */
function opencvIsReady() {
  console.log('OpenCV.js is ready');
	//una vez cargado Opencv, cargar el xml del clasificador
  handCascade = new cv.CascadeClassifier();
	//usar createFileFromUrl para "pre-construir" el xml
	utils.createFileFromUrl(faceCascadeFile, faceCascadeFile, () => {
			handCascade.load(faceCascadeFile); // in the callback, load the cascade from file 
	});

	//una vez cargado el clasificador, inicializar la camara
  startCamera();

}




var mousePointer = document.querySelector("#mousePointer");


/**
 * Mover la imagen del mouse relativo al viewport. Posicionar el centro de la imagen
 * en el centro de la mano calculada
 */
function moveMouse() {
	//Tamano del viewport
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	
	//Relacion aspecto viewport - canvas
	arW = w / width;
	arH = h / height;
	
	//Posicion de la mano respecto al viewport (En caso de que sea menor)
	mouseX = arW * Math.round(handPos.x + handPos.width/2);
	mouseY = arH * Math.round(handPos.y + handPos.height/2);
	
	//Tamano de la imagen del puntero
	var width_offset = Math.round(mousePointer.offsetWidth);
	var height_offset = Math.round(mousePointer.offsetHeight);

  //Calculo de la posicion centrada en la imagen
	mouseX_centered = mouseX - Math.round(width_offset/2);
	mouseY_centered = mouseY - Math.round(height_offset/2);

  //Reposicionamiento (movimiento) del puntero
	mousePointer.style.left = mouseX_centered + "px";
	mousePointer.style.top = mouseY_centered + "px";
}

/**
 * Cambia el icono del raton en funcion de su estado.
 */
function changeMouseIcon(state){
	switch(state){
        case "HAND_DETECT":
            mousePointer.src="images/puntero_verde.png";
            break;
        case "CLICK":
            mousePointer.src="images/puntero_azul.png";
            break;
        default:
            mousePointer.src="images/puntero_rojo.png";
    }
}

/**
 * Comprueba si el raton esta encima de un elemento "clickable" y de estarlo 
 * le pone el focus.
 */
 function checkMouse(){	 
 
	//Comprobar estado del raton y cambiar aspecto del puntero 
	if(mouseState == "HAND_DETECT")
		changeMouseIcon("HAND_DETECT");
	else if( mouseState == "IDDLE")
		changeMouseIcon("");
			 
	//Comprobar posicion y cambiar aspecto de los elementos de clase 'clickable'
	var clickables = document.getElementsByClassName('clickable');
	var mousePointerRect = mousePointer.getBoundingClientRect();
	
	//Calcular el centro del puntero
	var mouseCenterX = mousePointerRect.x + Math.round(mousePointerRect.width/2)
	var mouseCenterY = mousePointerRect.y + Math.round(mousePointerRect.height/2)

	for (var i = 0; i < clickables.length; ++i) {
	 if(clickables[i].style.display != "none"){
		 var domRect = clickables[i].getBoundingClientRect();
		 //Anadir el padding y el border al elemento para calcular el tamano del elemento
		 var rectRight = domRect.left + clickables[i].offsetWidth;
		 var rectBottom = domRect.top + clickables[i].offsetHeight;
		 //Comprobar si el puntero esta encima de algun elemento clickcable
		 if(mouseCenterX > domRect.left && mouseCenterX < rectRight && 
				 mouseCenterY < rectBottom && mouseCenterY > domRect.top){
			 //Si lo esta, darle poner focus
			 clickables[i].focus();
			 //Almacenar el id del elemento que esta con el focus
			 isHover = clickables[i].id;
			 break;
		 }
		 else{
			 //Si no lo esta, quitar focus
			 clickables[i].blur();
			 	//Almacenar el id del elemento que esta con el focus
			 isHover = "";
		 }
		}
	}
	   
}



/**
 * Ejemplo en caso de querer incluir la opcion de parar la camara
 */
// function stopCamera() {
  // if (!streaming) return;
  // stopVideoProcessing();
  // document.getElementById("canvasOutput").getContext("2d").clearRect(0, 0, width, height);
  // video.pause();
  // video.srcObject=null;
  // stream.getVideoTracks()[0].stop();
  // streaming = false;
// }

/**
 * Ejemplo para calcular fps. Descomentar y llamar a getFPS en la funcion 'processVideo'
 */
// window.requestAnimFrame = (function(){
  // return  window.requestAnimationFrame       ||
          // window.webkitRequestAnimationFrame ||
          // window.mozRequestAnimationFrame    ||
          // window.ieRequestAnimationFrame     ||
          // function( callback ){
            // window.setTimeout(callback, 1000 / 60);
          // };
// })();
// var then = Date.now() / 1000;  // get time in seconds

// function getFPS(){   
	// var now = Date.now() / 1000;  // get time in seconds
	// // compute time since last frame
	// var elapsedTime = now - then;
	// then = now;
	// // compute fps
	// var fps = 1 / elapsedTime;
	// return fps;
// }

