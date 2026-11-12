// contenedor principal donde se inyecta la informacion del servicio
const contenedor = document.getElementById('detalle');

// funcion auxiliar para crear elementos del dom con clases y texto
function crear(etiqueta, clases, texto) {
    const elemento = document.createElement(etiqueta);
    if (clases) {
        elemento.className = clases;
    }
    if (texto) {
        elemento.textContent = texto;
    }
    return elemento;
}

// muestra el mensaje de carga mientras se consulta el json
function mostrarCargando() {
    contenedor.replaceChildren(crear('p', 'cargando', 'Cargando servicio...'));
}

// muestra una tarjeta de error o aviso con enlace para regresar al catalogo
function mostrarMensaje(texto) {
    const caja = crear('div', 'error-carga');
    const volver = crear('a', 'btn btn-detalle-sm', 'Volver al catálogo');
    volver.href = 'catalogo.html';
    caja.append(crear('p', '', texto), volver);
    contenedor.replaceChildren(caja);
}

// crea un elemento individual de la ruta de navegacion (breadcrumbs)
function itemMiga(texto, enlace) {
    const item = crear('li', 'breadcrumb-item');
    if (enlace) {
        const a = crear('a', '', texto);
        a.href = enlace;
        item.appendChild(a);
    } else {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
        item.textContent = texto;
    }
    return item;
}

// construye y pinta toda la vista de detalle en el dom
function pintarDetalle(servicio, todos) {
    // actualiza el titulo de la pestaña con el nombre del servicio
    document.title = servicio.nombre + ' | DsGlam-Beauty';

    // 1. migas de pan para la navegacion
    const migas = crear('nav', 'breadcrumb-detalle');
    migas.setAttribute('aria-label', 'Ruta de navegación');
    const ruta = crear('ol', 'breadcrumb');
    ruta.append(
        itemMiga('Catálogo', 'catalogo.html'),
        itemMiga(servicio.categoria, 'catalogo.html'),
        itemMiga(servicio.nombre, null)
    );
    migas.appendChild(ruta);

    // 2. seccion con la imagen y la descripcion del servicio
    const seccion = crear('section', 'seccion-detalle');
    seccion.setAttribute('aria-label', 'Detalle del servicio');

    const figura = crear('figure', 'detalle-imagen');
    const foto = crear('img');
    foto.src = servicio.imagen;
    foto.alt = servicio.nombre + ' en DsGlam-Beauty';
    foto.width = 400;
    foto.height = 350;
    figura.appendChild(foto);

    const info = crear('article', 'detalle-info');

    // boton de contacto directo por whatsapp con mensaje personalizado
    const cajaPrecio = crear('div', 'detalle-precio-box');
    const contactar = crear('a', 'btn btn-contacto', 'Contáctanos aquí');
    contactar.href = 'https://wa.link/yz34tq';
    contactar.target = '_blank';
    contactar.rel = 'noopener noreferrer';
    contactar.setAttribute('aria-label', 'Contactar por WhatsApp para el servicio ' + servicio.nombre);
    cajaPrecio.append(crear('span', 'badge badge-precio fs-5', servicio.precio), contactar);

    // lista de especificaciones del servicio (duracion, incluye, etc)
    const especificaciones = crear('section', 'detalle-especificaciones');
    especificaciones.setAttribute('aria-label', 'Especificaciones del servicio');
    const lista = crear('ul');

    servicio.especificaciones.forEach(function(e) {
        const fila = crear('li');
        const icono = crear('i', e.icono);
        icono.setAttribute('aria-hidden', 'true');
        fila.append(icono, ' ', crear('strong', '', e.titulo + ': '), e.texto);
        lista.appendChild(fila);
    });
    especificaciones.appendChild(lista);

    info.append(
        crear('h1', '', servicio.nombre),
        crear('p', 'detalle-subtitulo', servicio.subtitulo),
        cajaPrecio,
        especificaciones
    );
    seccion.append(figura, info);

    // 3. sugerencias de otros servicios relacionados
    const otros = todos.filter(function(s) {
        return s.id !== servicio.id; // excluye el servicio que se esta viendo
    });
    const mismaCategoria = otros.filter(function(s) {
        return s.categoria === servicio.categoria; // prioriza la misma categoria
    });
    const demas = otros.filter(function(s) {
        return s.categoria !== servicio.categoria;
    });
    // toma maximo 3 servicios sugeridos
    const sugeridos = mismaCategoria.concat(demas).slice(0, 3);

    const cuadricula = crear('div', 'relacionados-grid');
    sugeridos.forEach(function(s) {
        const tarjeta = crear('article', 'card card-relacionado');

        const imagen = crear('img', 'card-img-top');
        imagen.src = s.imagen;
        imagen.alt = s.nombre;
        imagen.loading = 'lazy';

        const enlace = crear('a', 'btn btn-detalle-sm', 'Ver detalle →');
        enlace.href = 'detalle.html?id=' + s.id; // enlace con el id del servicio

        const cuerpo = crear('div', 'card-body');
        cuerpo.append(crear('h3', 'card-title', s.nombre), crear('p', 'card-text', s.precio), enlace);

        tarjeta.append(imagen, cuerpo);
        cuadricula.appendChild(tarjeta);
    });

    const verMas = crear('a', 'relacionados-vermas', 'Ver más');
    verMas.href = 'catalogo.html';

    const encabezado = crear('header', 'relacionados-encabezado');
    encabezado.append(crear('h2', '', 'También puede interesarte'), verMas);

    const relacionados = crear('section', 'seccion-relacionados');
    relacionados.setAttribute('aria-label', 'Servicios relacionados');
    relacionados.append(encabezado, cuadricula);

    // reemplaza todo el contenido del contenedor con las 3 partes creadas
    contenedor.replaceChildren(migas, seccion, relacionados);
}

// funcion asincrona para leer el id de la url y cargar los datos con fetch
async function cargarDetalle() {
    // extrae el parametro ?id= de la url
    const id = Number(new URLSearchParams(window.location.search).get('id'));

    // valida que exista un id numerico en la direccion
    if (!id) {
        mostrarMensaje('No indicaste qué servicio quieres ver.');
        return;
    }

    mostrarCargando(); // muestra indicador de carga

    try {
        // peticion asincrona al json de servicios
        const respuesta = await fetch('servicios.json');

        // control de errores de respuesta http
        if (!respuesta.ok) {
            const error = new Error('Error HTTP');
            error.estado = respuesta.status;
            throw error;
        }

        const servicios = await respuesta.json();
        // busca el servicio que coincida con el id solicitado
        const servicio = servicios.find(function(s) {
            return s.id === id;
        });

        // si el id no existe en los datos
        if (!servicio) {
            mostrarMensaje('No encontramos ese servicio.');
            return;
        }

        // pinta los detalles del servicio encontrado
        pintarDetalle(servicio, servicios);
    } catch (error) {
        // manejo de errores segun el codigo http o fallo de red
        if (error.estado === 404) {
            mostrarMensaje('No encontramos la información de los servicios (error 404).');
        } else if (error.estado >= 500) {
            mostrarMensaje('El servidor tiene problemas, intenta más tarde (error ' + error.estado + ').');
        } else if (error.estado) {
            mostrarMensaje('No se pudo cargar el servicio (error ' + error.estado + ').');
        } else {
            mostrarMensaje('Revisa tu conexión a internet e intenta de nuevo.');
        }
    }
}

// inicio automatico al cargar la pagina
cargarDetalle();
