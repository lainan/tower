/*
* AUTOR: Adrián Expósito Tofano
*/

/* eslint no-unused-vars: 0 */

// MOBILE

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
