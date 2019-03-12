# hand_detect_example

Ejemplo de movimiento de ratón usando la mano para la asignatura IPO 2019

Se puede probar en: https://samuel-m-p.github.io/hand_detect_example/index.html

## 1. Cómo usarlo

Permitir al navegador usar la cámara.

Para que funcione, se debe poner la mano abierta en posicion vertical y con los dedos separados como en esta imagen:

![My image](capturas/hand_recon.jpg)

Cuando se detecta una mano, el puntero (círculo rojo) se vuelve verde y sigue a la mano.

Si se situa la mano (con puntero verde - mano detectada) durante 2 segundos seguidos aproximadamente encima de un elemento que sea "clickable" se ejecuta el "click" en ese elemento.

*Nota: al ser un ejemplo simple, el tracking funciona bien con un fondo uniforme y buenas condiciones de iluminación. De otra forma es posible que el puntero de saltos.*

### 1.1. Prerequisitos

Una webcam :)

Probado en Firefox 65.0.2 (64-bits) y Chrome 72.0.3626.121 (Build oficial) (64-bits)

### 1.2. Descarga y ejecucion local

Descargar el proyecto. La forma más sencilla es descargarlo via web (Clone or Download => Download zip)

Descomprimir y abrir el archivo 'index.html' en el navegador.

*Nota: Debido a las restricciones a la hora de cargar el archivo xml del haarcascade, para hacer las pruebas en local he utilizado Firefox. Si usáis otros navegadores (ej. Chrome) obtendréis un error del tipo: Access to XMLHttpRequest at 'file:...' from origin 'null'.*

*Para solucionarlo, debéis ejecutar un servidor de prueba local. Lo más simple es a través de una instalación de python: https://developer.mozilla.org/es/docs/Learn/Common_questions/set_up_a_local_testing_server*

## 2. Cómo incluir/modificar elementos

Para incluir nuevos elementos y que queden por encima de la imagen de la cámara basta con añadirlos en *index.html* dentro del div que contiene el canvas de video:

```
<div class="canvas-container" id="container"> 
		<a href="javascript:void" id="button1" class="button clickable" onclick='button1_click();'>Button 1</a> 
    ... elemento
    ... elemento
<div>
```

A modo de ejemplo, el proyecto contiene 5 elementos (además del canvas donde se muestra el video). 4 de ellos son de tipo *<a href>* convertidos en botones y el otro es un botón normal inicialmente oculto. 

## 3. Cómo hacer elementos clickables

- En *index.html* los elementos incluidos deben ser de clase *class="clickable"*

Ejemplo incluido en *index.html*:

```
<a href="https://studium.usal.es/" id="button2" class="button clickable">Button 2</a>
```

Es de clase *button* y *clickable*. La clase *button* es para darle estilo con CSS. 

Al hacer click en el 'Button 2' nos envía a la página de studium.

### 3.1. Cómo incluir funcionalidad adicional al hacer click

- En *index.html* añadir el nombre de la función javascript que hará los cambios en la página cuando salte el evento de click. Se pone en el atributo "onclick" del elemento.

Como ejemplo, el primer 'boton' incluido en el html es de clase *clickable* y llamará a la función *button1_click()* cuando se pinche en él:

```
<a href="javascript:void" id="button1" class="button clickable" onclick='button1_click();'>Button 1</a> 
```

- En el fichero javascript incluido en (*/js/hand_detect.js*):
 
Aquí definís lo que queréis que ocurra al hacer click. A modo de ejemplo, la primera función del archivo (se llama igual *button1_click*) hace que desaparezca el elemento con *id=button1* al hacer click en él y aparezca el botón *regular_button*:

```
function button1_click(){
	var el = document.getElementById("button1").style.display = "none";
	var el1 = document.getElementById("regular_button").style.display = "block";
}
```

#### Otro ejemplo:

La segunda función que aparece en */js/hand_detect.js* hace lo mismo pero al revés, y se lanza al pinchar en el elemento: 

```
<button type="button" id="regular_button" class="clickable" onclick='regular_button_click();'>I'M A REGULAR BUTTON</button>
```

La funcion en javascript (/js/hand_detect.js):

```
function regular_button_click(){
	var el = document.getElementById("button1").style.display = "block";
	var el1 = document.getElementById("regular_button").style.display = "none";
}
```

### 3.2. Cómo modificar el tiempo que se tarda en hacer click

Al comienzo del archivo javascript (/js/hand_detect.js) tenéis dos variables que podéis cambiar para modificar el tiempo necesario para hacer click:

var timeClick = 2; //indica el tiempo (en seg) necesario para activar un click

var timeIddle = 1; //indica el tiempo (en seg) sin detectar mano para resetear la deteccion de click

- *timeClick*: es el tiempo (en seg) que el puntero debe estar con mano detectada (verde) sobre un elemento para hacer click.

- *timeIddle*: es el tiempo (en seg) sin detectar mano para resetear el contador anterior. Impide que al dejar el puntero encima de un elemento sin detectar mano se lance el click automáticamente.

## Enlaces

* [Python](http://www.dropwizard.io/1.0.2/docs/) - Instalar Python con Anaconda (Windows)
* [ROME](https://developer.mozilla.org/es/docs/Learn/Common_questions/set_up_a_local_testing_server) - Configurar un servidor de prueba local
* [OpenCV.js](https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html) - Tutoriales de OpenCV para javascript
* [OpenCV](https://docs.opencv.org/3.4.0/d9/df8/tutorial_root.html) - Tutoriales de OpenCV 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


