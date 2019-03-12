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

La segunda función que aparece en */js/hand_detect.js* hace lo mismo pero al revés, y se lanza al pinchar en el elemento 

```
<button type="button" id="regular_button" class="clickable" onclick='regular_button_click();'>I'M A REGULAR BUTTON</button>
```

javascript (/js/hand_detect.js):

```
function regular_button_click(){
	var el = document.getElementById("button1").style.display = "block";
	var el1 = document.getElementById("regular_button").style.display = "none";
}
```


Os he incluido tres ejemplos de elementos


```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
