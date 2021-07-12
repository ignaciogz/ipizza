window.addEventListener("load", init);

/* -------- INICIO Funciones de animaciones -------- */
const tipearMensaje = (function () {
    let i = 0;
    let txt = "Estamos preparando tu iPizza con mucho ";
    let speed = 60;
    return function () {
        if (i < txt.length) {
            document.getElementById('texto-tipeado').innerHTML += txt.charAt(i);
            i++;
            setTimeout(tipearMensaje, speed);
        } else {
            document.getElementById('texto-tipeado').innerHTML += "<i class='fas fa-heart'></i>";
        }
    };
})();

function shakeInicial(el) {
    el.classList.add('shake-on-load');
}

function removeShake() {
    this.classList.remove('shake-on-load');
}
/* -------- FIN Funciones de animaciones -------- */

/* -------- INICIO Funciones de la galeria de imagenes -------- */
function cargarFilaDeImagenes() {
    let imagenesSinMostrar = document.querySelectorAll('.galeria .d-none');
    imagenesSinMostrar[0].classList.remove('d-none');
    AOS.refreshHard();

    if(imagenesSinMostrar.length == 1) {
        // Quito el boton de carga de imagenes
        this.classList.add('d-none');
    }
}
/* -------- FIN Funciones de la galeria de imagenes -------- */

/* -------- INICIO Funciones relacionadas con media query -------- */
function quitarPaddingBottom() {
    document.body.classList.add('armala-padding-bottom');
}
/* -------- FIN Funciones relacionadas con media query -------- */

function init() {
    /* Animacion de shake inicial */
    const $btnArmalaHeader = document.getElementById('btn-armala-header');
    $btnArmalaHeader.addEventListener('animationend', removeShake, {once: true});
    shakeInicial($btnArmalaHeader);

    /* Controlador frontal basico */
    const paginaActual = location.pathname;
    switch (paginaActual) {
        case "/pedidos.html":
                // Tipeo h2 en pedidos.html
                document.getElementById('texto-tipeado').innerHTML = "";
                tipearMensaje();
            break;
        case "/nosotros.html":
                // Carga de imagenes ocultas en nosotros.html
                const $btnMostrarMasFotos = document.getElementById('btn-mostrar-mas-fotos');
                $btnMostrarMasFotos.addEventListener('click', cargarFilaDeImagenes);
            break;
        case "/armala.html":
                // Oculto boton armala
                $btnArmalaHeader.classList.add('d-sm-none');

                // Quito padding bottom, por ocultamiento de boton armala
                const mediaQuery = window.matchMedia("(min-width: 576px) and (max-width: 991.98px)");
                if(mediaQuery.matches) {
                    quitarPaddingBottom(); // Por carga de pagina
                }
                mediaQuery.addEventListener("change", function(eventoMediaQuery) {
                    if(eventoMediaQuery.matches) {
                        quitarPaddingBottom(); // Por redimensionado
                    }
                });
                
                // Pizza sin gustos seleccionados
                canvasPizza.mostrarCanvasInicial();

                // Desplegables
                const $desplegables = document.querySelectorAll('.gustos select');
                $desplegables.forEach(function(desplegable) {
                    desplegable.addEventListener('change', armala.calcularCostos);
                    desplegable.addEventListener('change', armala.mostrarPorciones);
                });

                // Control de la tarjeta visible en el carousel
                const $carouselProductos = document.getElementById('armala-carousel-productos');
                $carouselProductos.addEventListener('slid.bs.carousel', armala.actualizarPaginaArmala);

                // Botones de switch de la seccion extras
                const $extraChecks = document.querySelectorAll('.extras input[type=checkbox]');
                $extraChecks.forEach (function(inputCheck) {
                    inputCheck.addEventListener('change', armala.actualizarDetalleExtras);
                });

                // Boton de checkbox cono de papas
                const $checkboxPapas = document.getElementById('papas');
                $checkboxPapas.addEventListener('change', armala.actualizarDetalleCono);

                // Botones de radio de metodo de envio
                const $radioEnvio = document.getElementById('envio-a-domicilio');
                const $radioEnLocal = document.getElementById('retiro-en-local');

                $radioEnvio.addEventListener('change', armala.actualizarDetalleEnvio);
                $radioEnLocal.addEventListener('change', armala.actualizarDetalleEnvio);
            break;
    }
}