/*
* AUTOR: Adrián Expósito Tofano
*/

/* eslint no-unused-vars: 0 */

'use strict';

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
 * Devuelve un objeto con las componentes R, G y B de un color en formato RGB
 * @param  {String} RGBColor Color en un formato RGB
 * @return {Array}           Componentes del color RGB
 */
function getRBGComponents(RGBColor) {
    var colorRGBRegEx = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i;
    var matchRGB = colorRGBRegEx.exec(RGBColor);
    // Parsea los valores de R, G y B
    if (matchRGB) {
        return [parseInt(matchRGB[1]),
                parseInt(matchRGB[2]),
                parseInt(matchRGB[3])];
    } else {
        return undefined;
    }
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
    var RGBComponents = getRBGComponents(color);
    R = RGBComponents[0];
    G = RGBComponents[1];
    B = RGBComponents[2];

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

/**
 * Convierte un color a HSl (pasanso primero por RGB)
 * http://en.wikipedia.org/wiki/HSL_color_space.
 * @param  {String} color Color en formato valido
 * @return {Array}        Valores H, S, y L
 */
function convertColorToHSL(color) {
    color = convertColorToRGB(color);
    if (!color) {
        return undefined;
    }
    // R: Rojo, G: Verde, B: Azul (sRGB)
    var R, G, B;
    var RGBComponents = getRBGComponents(color);
    R = RGBComponents[0] / 255;
    G = RGBComponents[1] / 255;
    B = RGBComponents[2] / 255;

    var max = Math.max(R, G, B);
    var min = Math.min(R, G, B);
    var H, S, L = (max + min) / 2;

    if (max === min) {
        H = S = 0; // Acromático
    } else {
        var d = max - min;
        S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
        case R: H = (G - B) / d + (G < B ? 6 : 0); break;
        case G: H = (B - R) / d + 2; break;
        case B: H = (R - G) / d + 4; break;
        }
        H /= 6;
    }
    return [ H * 359, S * 100, L * 100];
}

/**
 * Consigue un color de la rueda de color (HSL) basado en los grados (offset) y el color inicial dado
 * @param  {String} color    Color en formato valido
 * @param  {Interger} offset Separación en grados entre el color dado y el resultante
 * @return {String}          Color resultante
 */
function getColorFromWheel(color, offset)  {
    var HSLComponents = convertColorToHSL(color);
    var H = HSLComponents[0];
    var S = HSLComponents[1];
    var L = HSLComponents[2];
    H = (H + offset) % 360;
    return convertColorToRGB('hsl({0}, {1}%, {2}%)'.format(H, S, L));
}

/**
 * Consigue el color complementario
 * @param  {String} color Color en formato valido
 * @return {String}       Color complementario en formato RGB
 */
function getComplementaryColor(color) {
    return getColorFromWheel(color, 180);
}
