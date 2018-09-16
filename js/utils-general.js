/*
* AUTOR: Adrián Expósito Tofano
*/

/* eslint no-unused-vars: 0 */

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
