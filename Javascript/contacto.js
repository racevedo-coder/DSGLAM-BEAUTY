//DOM

const campoMensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');
const lista = document.getElementById('lista-solicitudes');
const formulario = document.querySelector('form');
let solicitudEditando = null;
const botonEnviar = formulario.querySelector('.btn-enviar');


const seccionForm = document.querySelector('.sectionformulario');
const fondo = document.getElementById('fondo-modal');
const botonCancelar = formulario.querySelector('.btn-cancelar');
const CLAVE = 'solicitudes'; //nombre con el que se guarda la lista en el navegador

//Obtener las solicitudes
function obtenerSolicitudes() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE)) || []; //lee lo guardado
    } catch (error) {
        return [];
    }
}

function guardarSolicitudes(solicitudes) {
    localStorage.setItem(CLAVE, JSON.stringify(solicitudes));
}


function abrirEdicion() {
    seccionForm.classList.add('modo-edicion');
    fondo.classList.add('visible');
}

function cerrarEdicion() {
    solicitudEditando = null;
    botonEnviar.lastChild.textContent = ' Enviar mensaje';
    formulario.reset();
    seccionForm.classList.remove('modo-edicion');
    fondo.classList.remove('visible');
}

function actualizarContador() {
    const cantidad = campoMensaje.value.length;
    contador.textContent = `${cantidad}/500`;
    contador.classList.toggle('limite', cantidad >= 450);
}

function abrirTarjeta() {
    lista.classList.add('abierta');
    fondo.classList.add('visible');
}

function cerrarTarjeta() {
    lista.classList.remove('abierta');
    fondo.classList.remove('visible');
}

function crearTarjeta(datos, esNueva) {
    const tarjeta = document.createElement('article');
    tarjeta.classList.add('solicitud');

    if (esNueva) {
        const aviso = document.createElement('h2');
        aviso.textContent = '¡Solicitud enviada!';
        tarjeta.appendChild(aviso);
    }

    
     // Agregar contenido a la tarjeta
     const titulo = document.createElement('h3');
     titulo.textContent = datos.nombre;

     const [anio, mes, dia] = datos.fecha.split('-');
     const fecha2 = `${dia}/${mes}/${anio}`;

    const detalle = document.createElement('ul');
    detalle.classList.add('detalle');

    const filas = [
    ['Teléfono', datos.telefono],
    ['Correo', datos.correo],
    ['Fecha', fecha2],
    ['Mensaje', datos.mensaje]
   ];

   filas.forEach(function(fila) {
    const item = document.createElement('li');

    const etiqueta = document.createElement('strong');
    etiqueta.textContent = fila[0] + ': ';

    item.appendChild(etiqueta);
    item.appendChild(document.createTextNode(fila[1]));
    detalle.appendChild(item);
    });

   // Crear botones de acción
    const botonEditar = document.createElement('button');
    botonEditar.textContent = 'Editar';
    botonEditar.type = 'button';
    botonEditar.classList.add('btn-editar');

    const botonQuitar = document.createElement('button');
    botonQuitar.textContent = 'Cancelar solicitud';
    botonQuitar.type = 'button';
    botonQuitar.classList.add('btn-quitar');

    const botonAceptar = document.createElement('button');
    botonAceptar.textContent = 'Aceptar';
    botonAceptar.type = 'button';
    botonAceptar.classList.add('btn-aceptar');

    botonEditar.addEventListener('click', function() {
    document.getElementById('nombre').value = datos.nombre;
    document.getElementById('telefono').value = datos.telefono;
    document.getElementById('correo').value = datos.correo;
    document.getElementById('fecha').value = datos.fecha;
    document.getElementById('mensaje').value = datos.mensaje;
    solicitudEditando=datos;
    botonEnviar.lastChild.textContent = 'Guardar cambios';
    cerrarTarjeta();
    actualizarContador();
    abrirEdicion();
     });

     // Agregar evento para eliminar la tarjeta
    botonQuitar.addEventListener('click', function() {
     if (!confirm('¿Seguro que quieres cancelar esta solicitud?')) {
        return;
    }
        const restantes = obtenerSolicitudes().filter(function(s) {
            return s.id !== datos.id;
        });
        guardarSolicitudes(restantes);
        tarjeta.remove();
        if (lista.children.length === 0) {
            cerrarTarjeta();
        }
    });

    botonAceptar.addEventListener('click', cerrarTarjeta);

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(detalle);
    if (esNueva) {
    tarjeta.appendChild(botonEditar);
   }
    tarjeta.appendChild(botonQuitar);
    if (esNueva) {
    tarjeta.appendChild(botonAceptar);
}

    return tarjeta;

}   

botonCancelar.addEventListener('click', cerrarEdicion);
fondo.addEventListener('click', function() {
    cerrarEdicion();
    cerrarTarjeta();
});

// Actualizar el contador de caracteres al escribir en el campo de mensaje
campoMensaje.addEventListener('input', actualizarContador);

// Actualizar el contador de caracteres al cargar la página
formulario.addEventListener('reset', function() {
    setTimeout(actualizarContador, 0);
});

formulario.addEventListener('submit', function(event) {
  event.preventDefault(); // Procesar el formulario, evita que se recargue la página
   
   const datos = {
        id: solicitudEditando ? solicitudEditando.id : Date.now(),
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        fecha: document.getElementById('fecha').value,
        mensaje: document.getElementById('mensaje').value
    };

    const solicitudes = obtenerSolicitudes();
    const posicion = solicitudes.findIndex(function(s) {
        return s.id === datos.id;
    });

    if (posicion === -1) {
        solicitudes.push(datos);
    } else {
        solicitudes[posicion] = datos;
    }
    guardarSolicitudes(solicitudes);

    cerrarEdicion();
    lista.replaceChildren(crearTarjeta(datos, true));
    abrirTarjeta();
});

// Ver todas las solicitudes guardadas (solo si ya pusiste el botón en el HTML)
document.getElementById('ver-solicitudes').addEventListener('click', function() {
    const solicitudes = obtenerSolicitudes();

    if (solicitudes.length === 0) {
        alert('Aún no tienes solicitudes guardadas.');
        return;
    }

    const nota = document.createElement('p');
    nota.classList.add('nota-local');
    nota.textContent = 'Estas solicitudes se guardan solo en este dispositivo.';

   const botonX = document.createElement('button');
   botonX.type = 'button';
   botonX.textContent = '×';
   botonX.classList.add('btn-x');
   botonX.setAttribute('aria-label', 'Cerrar solicitudes');
   botonX.addEventListener('click', cerrarTarjeta);
    
   lista.replaceChildren(botonX, nota, ...solicitudes.map(function(s) {
    return crearTarjeta(s, false);
}));
    abrirTarjeta();
});


