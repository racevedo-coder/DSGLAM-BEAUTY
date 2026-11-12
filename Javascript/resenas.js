// referencias a los elementos del dom
const contenedor = document.getElementById('resenas');
const CLAVE_RESENAS = 'resenasNuevas';
let resenasBase = []; // almacena las opiniones traidas del json

const fondoOpinion = document.getElementById('fondo-opinion');
const ventanaOpinion = document.getElementById('ventana-opinion');
const formOpinion = document.getElementById('form-opinion');

// obtiene las opiniones guardadas por el usuario en localstorage
function obtenerNuevas() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_RESENAS)) || [];
    } catch (error) {
        return [];
    }
}

// guarda el arreglo de nuevas opiniones en localstorage
function guardarNuevas(lista) {
    localStorage.setItem(CLAVE_RESENAS, JSON.stringify(lista));
}

// une las opiniones de localstorage con las del json y las pinta
function mostrarTodas() {
    pintarResenas([...obtenerNuevas(), ...resenasBase]);
}

// muestra el mensaje de carga mientras se hace fetch
function mostrarCargando() {
    const cargando = document.createElement('p');
    cargando.classList.add('cargando');
    cargando.textContent = 'Cargando opiniones...';
    contenedor.replaceChildren(cargando);
}

// muestra mensaje de error con un boton para reintentar la peticion
function mostrarError(mensaje) {
    const caja = document.createElement('div');
    caja.classList.add('error-carga');

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    const reintentar = document.createElement('button');
    reintentar.type = 'button';
    reintentar.textContent = 'Reintentar';
    reintentar.addEventListener('click', cargarResenas); // vuelve a intentar el fetch

    caja.append(texto, reintentar);
    contenedor.replaceChildren(caja);
}

// crea dinamicamente las tarjetas de resenas en el dom
function pintarResenas(resenas) {
    const tarjetas = resenas.map(function(r) {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('resena');

        // calcula estrellas llenas y vacias
        const estrellas = document.createElement('p');
        estrellas.classList.add('estrellas');
        estrellas.textContent = '★'.repeat(r.estrellas) + '☆'.repeat(5 - r.estrellas);
        estrellas.setAttribute('aria-label', r.estrellas + ' de 5 estrellas');

        const comentario = document.createElement('p');
        comentario.textContent = r.comentario;

        const autora = document.createElement('strong');
        autora.textContent = r.nombre;

        const servicio = document.createElement('small');
        servicio.textContent = r.servicio;

        tarjeta.append(estrellas, comentario, autora, servicio);

        // si la reseña fue creada por el usuario, permite eliminarla
        if (r.propia) {
            const borrar = document.createElement('button');
            borrar.type = 'button';
            borrar.classList.add('btn-borrar');
            borrar.textContent = 'Eliminar mi opinión';

            // confirma y elimina la reseña de localstorage
            borrar.addEventListener('click', function() {
                if (!confirm('¿Quieres eliminar tu opinión?')) {
                    return;
                }
                guardarNuevas(obtenerNuevas().filter(function(n) {
                    return n.id !== r.id;
                }));
                mostrarTodas(); // actualiza la vista
            });
            tarjeta.appendChild(borrar);
        }

        return tarjeta;
    });

    contenedor.replaceChildren(...tarjetas);
}

// peticion asincrona con fetch y async/await a data.json
async function cargarResenas() {
    mostrarCargando(); // muestra loader

    try {
        const respuesta = await fetch('data.json');

        // si el servidor responde con codigo de error (404, 500, etc)
        if (!respuesta.ok) {
            const error = new Error('Error HTTP');
            error.estado = respuesta.status;
            throw error;
        }

        resenasBase = await respuesta.json(); // guarda los datos recibidos
        mostrarTodas();

    } catch (error) {
        // manejo de errores segun el codigo de respuesta
        if (error.estado === 404) {
            mostrarError('No encontramos las opiniones (error 404).');
        } else if (error.estado >= 500) {
            mostrarError('El servidor tiene problemas, intenta más tarde (error ' + error.estado + ').');
        } else if (error.estado) {
            mostrarError('No se pudieron cargar las opiniones (error ' + error.estado + ').');
        } else {
            mostrarError('Revisa tu conexión a internet e intenta de nuevo.');
        }
    }
}

// limpia los textos y clases de error del formulario
function limpiarErroresOpinion() {
    formOpinion.querySelectorAll('.error-campo').forEach(function(e) {
        e.textContent = '';
    });
    formOpinion.querySelectorAll('.invalido, .valido').forEach(function(e) {
        e.classList.remove('invalido', 'valido');
    });
}

// abre el modal de opinion y pone el foco en el nombre
function abrirOpinion() {
    ventanaOpinion.classList.add('abierta');
    fondoOpinion.classList.add('visible');
    document.getElementById('op-nombre').focus();
}

// cierra el modal, limpia los campos y los errores
function cerrarOpinion() {
    ventanaOpinion.classList.remove('abierta');
    fondoOpinion.classList.remove('visible');
    formOpinion.reset();
    limpiarErroresOpinion();
}

// listeners para abrir y cerrar el modal
document.getElementById('abrir-opinion').addEventListener('click', abrirOpinion);
document.getElementById('cancelar-opinion').addEventListener('click', cerrarOpinion);
fondoOpinion.addEventListener('click', cerrarOpinion);

// cerrar modal al presionar la tecla escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarOpinion();
    }
});

// reglas de validacion para cada campo del formulario
const reglasOpinion = {
    'op-nombre': function() {
        const valor = document.getElementById('op-nombre').value.trim();
        if (valor === '') return 'Escribe tu nombre.';
        if (valor.length < 3) return 'Tu nombre debe tener mínimo 3 letras.';
        return '';
    },
    'op-servicio': function() {
        return document.getElementById('op-servicio').value === '' ? 'Elige el servicio.' : '';
    },
    'op-estrellas': function() {
        return formOpinion.querySelector('input[name="estrellas"]:checked') ? '' : 'Elige una calificación.';
    },
    'op-comentario': function() {
        const largo = document.getElementById('op-comentario').value.trim().length;
        if (largo === 0) return 'Cuéntanos cómo te fue.';
        if (largo < 10) return 'Cuéntanos un poco más (mínimo 10 caracteres).';
        return '';
    }
};

// obtiene el elemento que llevara el borde rojo o verde
function marcaDe(id) {
    return id === 'op-estrellas'
        ? formOpinion.querySelector('.estrellas-input')
        : document.getElementById(id);
}

// ejecuta la validacion del campo y actualiza clases y mensaje
function validarOpinion(id) {
    const mensaje = reglasOpinion[id]();
    const marca = marcaDe(id);

    document.getElementById('error-' + id).textContent = mensaje;
    marca.classList.toggle('invalido', mensaje !== '');
    marca.classList.toggle('valido', mensaje === '');

    return mensaje === '';
}

// validacion en tiempo real al perder el foco (blur) o al escribir (input)
['op-nombre', 'op-servicio', 'op-comentario'].forEach(function(id) {
    const campo = document.getElementById(id);

    campo.addEventListener('blur', function() {
        validarOpinion(id);
    });

    campo.addEventListener('input', function() {
        if (campo.classList.contains('invalido') || campo.classList.contains('valido')) {
            validarOpinion(id);
        }
    });
});

// validacion inmediata al cambiar el select de servicio
document.getElementById('op-servicio').addEventListener('change', function() {
    validarOpinion('op-servicio');
});

// validacion inmediata al seleccionar estrellas
formOpinion.querySelectorAll('input[name="estrellas"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        validarOpinion('op-estrellas');
    });
});

// envio del formulario con submit y preventdefault
formOpinion.addEventListener('submit', function(event) {
    event.preventDefault(); // evita recargar la pagina

    let todoBien = true;

    // revisa cada campo y enfoca el primero con error
    Object.keys(reglasOpinion).forEach(function(id) {
        if (!validarOpinion(id)) {
            if (todoBien) {
                const primero = id === 'op-estrellas' ? document.getElementById('e5') : document.getElementById(id);
                primero.focus();
            }
            todoBien = false;
        }
    });

    // si hay errores, detiene el envio
    if (!todoBien) {
        return;
    }

    // crea el objeto con los datos de la opinion
    const nueva = {
        id: Date.now(),
        nombre: document.getElementById('op-nombre').value.trim(),
        servicio: document.getElementById('op-servicio').value,
        estrellas: Number(formOpinion.querySelector('input[name="estrellas"]:checked').value),
        comentario: document.getElementById('op-comentario').value.trim(),
        propia: true
    };

    // agrega al inicio del arreglo y persiste en localstorage
    const nuevas = obtenerNuevas();
    nuevas.unshift(nueva);
    guardarNuevas(nuevas);

    cerrarOpinion();
    mostrarTodas(); // refresca las tarjetas en pantalla
});

// carga inicial de resenas al abrir la pagina
cargarResenas();
