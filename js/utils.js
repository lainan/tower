/*
* AUTOR: Adrián Expósito Tofano
*/

/* eslint no-unused-vars: 0 */

'use strict';

// MODIFICACIONES DE OBJETOS INCORPORADOS (standard built-in objects)

/**
 * Comprueba si el número está comprendido entre otros dos (a, b) con un
 * parámetro  opcional 'inclusive' para incluir a y b en la comparación (activado
 * de forma predeterminada)
 * @param  {Integer}  a               Uno de los límites del rango
 * @param  {Integer}  b               El otro límite del rango
 * @param  {Boolean} [inclusive=true] Indica si se deben considerar los límites
 * @return {Boolean}                  Indica si el número está en el rango
 */
Number.prototype.between = function(a, b, inclusive=true) {
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    if (inclusive) {
        return this >= min && this <= max;
    } else {
        return this > min && this < max;
    }
};

/**
 * Devuelve el número en formato string con el tamaño dado,
 * utilizando ceros como padding izquierdo
 * @param  {[type]} size Tamaño mínimo de la cadena final
 * @return {[type]}      Numero en formato string con el padding
 */
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < size) {
        s = '0' + s;
    }
    return s;
};

/**
 * Función simple para formato de cadenas (utiliza la sintaxis {Índice de argumento})
 * @return {String} Cadena formateada
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] !== 'undefined'
            ? args[number]
            : match
        ;
    });
};


// BÁSICO

/**
 * Devuelve un número aleatorio en el rango especificado
 * @param  {Integer}  a Uno de los límites del rango
 * @param  {Integer}  b El otro límite del rango
 * @return {Integer}    Número aleatorio
 */
function getRandomInt(a, b) {
    var min = Math.min(a, b);
    var max = Math.max(a, b);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Baraja un array con una versión moderna del algoritmo de Fisher-Yates
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 * https://bost.ocks.org/mike/shuffle/
 * @param  {Array} array Array a barajar
 * @return {Array}       Array barajado
 */
function shuffle(array) {
    var newArray = array.slice(0);
    var currentIndex = newArray.length - 1;
    var temporaryValue;
    var randomIndex;

    // Mientras que queden elemnentos
    while (currentIndex != 0) {
        // Elegimos un elemento aleatorio
        randomIndex = getRandomInt(0, currentIndex);
        // Y lo intercambiamos con el elemento actual
        temporaryValue = newArray[currentIndex];
        newArray[currentIndex] = newArray[randomIndex];
        newArray[randomIndex] = temporaryValue;
        currentIndex -= 1;
    }

    return newArray;
}

/**
 * Comprueba si dos arrays son iguales
 * @param  {Array} array1 Primer array a comparar
 * @param  {Array} array2 Segundo array a comparar
 * @return {Boolean}      Indica si son iguales o no
 */
function arraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
}


// MANIPULACIÓN DEL DOM

/**
 * Añade un elemento HTML (con las carectiscas dadas) a otro (según su ID)
 * @param  {String} parentID ID del elemento padre
 * @param  {String} type       Tipo de etiqueta HTML
 * @param  {Object} attributes Array con los atributos del nuevo elemento
 * @param  {String} text       Texto del nuevo elemento
 * @return {Object}            Referencia al nuevo elemento creado
 */
function appendNewElement(parentID, type, attributes, text) {
    var parent = document.getElementById(parentID);
    var element = document.createElement(type);

    if (attributes) {
        for (var name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                element.setAttribute(name, attributes[name]);
            }
        }
    }

    if (text) {
        var elementText = document.createTextNode(text);
        element.appendChild(elementText);
    }

    parent.appendChild(element);
    return element;
}


// COLOR

/**
 * Devuelve un color aleatorio en formato hexadecimal
 */
function getRandomHexColor() {
    /* Genera un número aleatorio (entre 0 y 1), lo convierte a hexacimal y
    coge los 6 primeros digitos de la parte fraccionaria, le suma 6 ceros al
    principio en forma de cadena y se queda con los últimos 6 dígitos (esto
    último evita que se devuelvan menos de 6 digitos hex. en algunos casos
    devido a Math.random()). */
    return '#' + ('000000' + Math.random().toString(16).slice(2, 8)).slice(-6);
}

/**
 * Devuelve el color (blanco o negro) que hace mejor contraste con el color dado
 * Utiliza un algoritmo de luminocidad relativa y relación de contraste
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param  {String} color Color en un formato que acepte el navegador
 * @return {String}       Color en hexadecimal que hace mejor contraste (blanco o negro)
 */
function getContrastColor(color) {
    color = convertColorToRGB(color);
    if (!color) {
        return undefined;
    }
    // R: Rojo, G: Verde, B: Azul (sRGB)
    // C: Intensidades RGB lineales
    // L: luminocidad relativa
    var R, G, B, C, L;
    var colorRGBRegEx = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i;
    var matchRGB = colorRGBRegEx.exec(color);

    // Parsea los valores de R, G y B
    if (matchRGB) {
        R = parseInt(matchRGB[1]);
        G = parseInt(matchRGB[2]);
        B = parseInt(matchRGB[3]);
    } else {
        return undefined;
    }

    // Convertimos de notación digital de 8-bits (0-255) a aritmetica (0.0-1.0)
    C = [R/255.0, G/255.0, B/255.0];
    // Convertimos los valores sRGB a sus intensidades lineales
    for (var i = 0; i < 3; i++) {
        if (C[i] <= 0.04045) {
            C[i] = C[i] / 12.92;
        } else {
            C[i] = Math.pow((C[i] + 0.055)/1.055, 2.4);
        }
    }
    // Luminocidad relativa (para la especificación Rec. 709), siendo 0 muy
    // oscuro y 1 muy brillante
    L = 0.2126 * C[0] + 0.7152 * C[1] + 0.0722 * C[2];

    // Según la formula de relación de contraste (L1 + 0.05) / (L2 + 0.05)
    if (L > 0.179) {
        return '#000000';
    } else {
        return '#ffffff';
    }
}

/**
 * Convierte un color en cualquier formato valido (alias, hexadecimal corto,
 * hexadecimal completo, rgb(), hsl()) a formato rgb(). Valores fuera de los
 * limites en rgb() y hsl() se redondean al límite más cercano
 * - Devuelve undefined si el color dado no es valido
 * - Algunos navegadores lanzan mensajes warn() si el color no es valido
 * - Compatible con IE9+
 * @param  {String} color Color en formato valido
 * @return {String}       Color en formato RGB
 */
function convertColorToRGB(color) {
    var d = document.createElement('div');
    d.style.color = color;
    // En caso de que el formato sea incorrecto la propiedad queda sin asignar
    if (d.style.color != '') {
        document.body.appendChild(d);
        // El color se computa al formato rgb()
        var colorRGB = window.getComputedStyle(d).color;
        document.body.removeChild(d);
        return colorRGB;
    } else {
        return undefined;
    }
}


// OTROS

/**
 * Solución multi-plataforma para pedir/activar el modo de pantalla completa
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API#Prefixing
 * https://developers.google.com/web/fundamentals/native-hardware/fullscreen/
 */
function toggleFullScreen() {
    var d = window.document;
    var de = d.documentElement;
    var requestFullScreen = (de.requestFullscreen || de.mozRequestFullScreen ||
                             de.webkitRequestFullScreen || de.msRequestFullscreen);
    var cancelFullScreen = (d.exitFullscreen || d.mozCancelFullScreen ||
                            d.webkitExitFullscreen || d.msExitFullscreen);

    if (!d.fullscreenElement && !d.mozFullScreenElement &&
        !d.webkitFullscreenElement && !d.msFullscreenElement) {
        requestFullScreen.call(de);
    } else {
        cancelFullScreen.call(d);
    }
}
