const armala = (function () {
    const LISTA_DE_PRECIOS = {
        precioPorcion: {
            'muzzarella': 30, 
            'jamon': 42,
            'napolitana': 45,
            'calabresa': 50
        },
        "oregano": 11,
        "aceitunas": 12,
        "doble-queso": 13,
        "cheddar": 14,
        "papas": 20,
        "retiro-en-local": 0,
        "envio-a-domicilio": 100
    }
    
    const UBICACION_EN_DETALLE_EXTRAS = [
        'oregano',
        'aceitunas',
        'doble-queso',
        'cheddar'
    ]

    const IPIZZAS = {
        i1: {
            cantidadDeGustos: 1,
            cantidadDePorcionesPorGusto: 8,
            porciones: [
                {index: 8, gusto: null}
            ]
        },
        i2: {
            cantidadDeGustos: 2,
            cantidadDePorcionesPorGusto: 4,
            porciones: [
                {index: 8, gusto: null}, 
                {index: 4, gusto: null}
            ]
        },
        i4: {
            cantidadDeGustos: 4,
            cantidadDePorcionesPorGusto: 2,
            porciones: [
                {index: 8, gusto: null}, 
                {index: 6, gusto: null},
                {index: 4, gusto: null},
                {index: 2, gusto: null}
            ]
        }
    }

    /* Logica de desplegables en armala.html */
    function mostrarPorciones(event) {
        const nombreGusto = event.target.value;
        const nombreGustoPatron = nombreGusto + "Patron";
        const mostrar = (nombreGusto != "Default") ? true : false;

        const IDSelect = obtenerIDdelDesplegable(event);
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();
        
        const ubicacionEnCanvas = iPizzaSeleccionada.porciones[IDSelect].index;
        // Guardo el gusto que selecciono el usuario
        iPizzaSeleccionada.porciones[IDSelect].gusto = (nombreGusto != "Default") ? canvasPizza[nombreGustoPatron] : null;

        if(mostrar) {
            canvasPizza.dibujarPorciones(iPizzaSeleccionada.cantidadDePorcionesPorGusto, canvasPizza[nombreGustoPatron], ubicacionEnCanvas);
        } else {
            canvasPizza.reDibujarPorciones(iPizzaSeleccionada);
        }
    }

    function calcularCostos(event) {
        let nombreGusto = '***';
        let precioFinalGusto = '***';

        const IDSelect = obtenerIDdelDesplegable(event);
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();

        if (event.target.value != "Default") {
            nombreGusto = event.target.value;
            const precioGusto = LISTA_DE_PRECIOS["precioPorcion"][nombreGusto];
            
            precioFinalGusto = iPizzaSeleccionada.cantidadDePorcionesPorGusto * precioGusto;
        }

        let $detallePorciones = obtenerDetallePorciones();

        // Muestro los li necesarios
        let liNuevo = crearElementoDeLista(iPizzaSeleccionada.cantidadDePorcionesPorGusto, nombreGusto, precioFinalGusto);
        mostrarDetallePorciones($detallePorciones, IDSelect, liNuevo);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }

    /* INICIO Control de tarjeta visible en el carousel */
    function actualizarPaginaArmala() {
        const iPizzaSeleccionada = obtenerInfoDeiPizzaSeleccionada();
        const $desplegables = obtenerDesplegables();
        cantidadDeDesplegables = $desplegables.length;
        
        let $detallePorciones = obtenerDetallePorciones();

        // Oculto todos los desplegables
        for(let i=0; i < cantidadDeDesplegables; i++) {
            $desplegables[i].classList.add('d-none');
            $desplegables[i].selectedIndex = 0;
            
            // Muestro los li necesarios
            let liGenerico = crearElementoDeLista(iPizzaSeleccionada.cantidadDePorcionesPorGusto, '***', '***', false);
            mostrarDetallePorciones($detallePorciones, i, liGenerico);
        }
        
        $detallePorciones = obtenerDetallePorciones(); // Actualizo la referencia al DOM

        // Muestro los desplegables necesarios
        for(let i=0; i < iPizzaSeleccionada.cantidadDeGustos; i++) {
            $desplegables[i].classList.remove('d-none');
            $detallePorciones[i].classList.toggle('d-none');
        }
        
        canvasPizza.mostrarCanvasInicial();
        inicializarUbicacionesDePorciones(iPizzaSeleccionada);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }
    /* FIN Control de tarjeta visible en el carousel */

    function obtenerDesplegables() {
        return $desplegables = document.querySelectorAll('.gustos select');
    }

    function obtenerIDdelDesplegable(event) {
        return parseInt(event.target.getAttribute('data-ipizza-gusto-num')) - 1;
    }

    function obtenerInfoDeiPizzaSeleccionada() {
        const $tarjetaSeleccionada = document.querySelector('.active .tarjeta-de-producto');
        const modelo = $tarjetaSeleccionada.getAttribute('data-ipizza-modelo');

        return informacionDeiPizza = obtenerInfoDeiPizza(modelo);
    }

    function obtenerDetallePorciones() {
        return document.querySelectorAll('.detalle-porciones li');
    }

    function mostrarDetallePorciones($detallePorciones, posicion, elementoNuevo) {
        $detallePorciones[posicion].replaceWith(elementoNuevo);
    }

    function obtenerDivPrecio(identificador) {
        return document.querySelector(identificador);
    }

    function obtenerDivsPrecio(identificador) {
        return document.querySelectorAll(identificador);
    }

    function verificarChecked(identificador) {
        const $checkboxs = document.querySelectorAll(identificador);
        let algunoChecked = false;

        $checkboxs.forEach(function(inputCheck) {
            if (inputCheck.checked) {
                algunoChecked = true;
            }
        });

        return algunoChecked;
    }

    function obtenerUbicacionDetalleExtras(IDCheckbox) {
        return UBICACION_EN_DETALLE_EXTRAS.indexOf(IDCheckbox);
    }

    function obtenerInfoDeiPizza(modelo) {
        return IPIZZAS[modelo];
    }

    function inicializarUbicacionesDePorciones(iPizzaSeleccionada) {
        iPizzaSeleccionada.porciones.forEach(function(porcion) {
            porcion.gusto = null;
        });
    }

    /* INICIO Creacion de Elemento de Lista */
    function crearElementoDeLista(cantPorciones, gusto, precio, visible = true) {
        const display = visible ? "" : " d-none";

        const li = document.createElement("li");
        li.setAttribute("class", "d-flex justify-content-between" + display);
        li.textContent = cantPorciones + " porciones de " + gusto;

        const divPrecio = crearDivPrecio(precio);

        li.appendChild(divPrecio);

        return li;
    }

    function crearDivPrecio(precio) {
        const divPrecio = document.createElement("div");
        divPrecio.setAttribute("class", "precio");
        divPrecio.textContent = precio;

        return divPrecio;
    }
    /* FIN Creacion de Elemento de Lista */

    /* INICIO Costo total */
    function calcularCostoTotal() {
        const $precios = document.querySelectorAll('li:not(.d-none) div.precio');
        const cantPrecios = $precios.length;
        let costoTotal = 0;

        for (let i = 0; i < cantPrecios; i++) {
            costoTotal += parseInt($precios[i].textContent);
        }

        return costoTotal;
    }

    function mostrarCostoTotal(costoTotal) {
        const $precioTotal = document.querySelector('div.precio-total');

        if (isNaN(costoTotal)) {
            $precioTotal.textContent = "0";
        } else {
            $precioTotal.textContent = costoTotal;
        }
    }
    /* FIN Costo total */


    /* Checkbox cono de papas! */
    function actualizarDetalleCono() {
        const $seccionDetalleCono = document.querySelector('.detalle-cono');
        $seccionDetalleCono.classList.toggle('d-none');
        const precio = LISTA_DE_PRECIOS['papas'];
        
        const divPrecio = crearDivPrecio(precio);

        const $divPrecio = obtenerDivPrecio('.detalle-cono .precio');
        $divPrecio.parentNode.classList.toggle('d-none');
        $divPrecio.replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }


    /* Botones de switch de Extras ! */
    function actualizarDetalleExtras(event) {
        const $seccionDetalleExtras = document.querySelector('.detalle-extras');
        const IDCheckbox = event.target.id;
        const precio = LISTA_DE_PRECIOS[IDCheckbox];

        const ubicacion = obtenerUbicacionDetalleExtras(IDCheckbox);
        const algunoChecked = verificarChecked('.extras input[type=checkbox]');
        
        if (algunoChecked) {
            $seccionDetalleExtras.classList.remove('d-none');
        } else {
            $seccionDetalleExtras.classList.add('d-none');
        }
        
        const divPrecio = crearDivPrecio(precio);

        const $divsPrecio = obtenerDivsPrecio('.detalle-extras .precio');
        $divsPrecio[ubicacion].parentNode.classList.toggle('d-none');
        $divsPrecio[ubicacion].replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);
    }


    /* Radio de envio a domicilio ! */
    function actualizarDetalleEnvio(event) {
        const IDRadio = event.target.id;
        const precio = LISTA_DE_PRECIOS[IDRadio];
        
        const divPrecio = crearDivPrecio(precio);

        const $divPrecio = obtenerDivPrecio('.detalle-envio .precio');
        $divPrecio.replaceWith(divPrecio);

        const costoTotal = calcularCostoTotal();
        mostrarCostoTotal(costoTotal);   
    }

    return {
        "mostrarPorciones" : mostrarPorciones,
        "calcularCostos" : calcularCostos,
        "actualizarPaginaArmala" : actualizarPaginaArmala,
        "actualizarDetalleCono": actualizarDetalleCono,
        "actualizarDetalleExtras" : actualizarDetalleExtras,
        "actualizarDetalleEnvio" : actualizarDetalleEnvio
    }
})();