## DsGlam-Beauty
Sitio web para el salón de belleza **DsGlam-Beauty**, enfocado en resaltar la mejor versión de cada cliente a través de servicios de maquillaje social, diseño de cejas, keratinas y tratamientos capilares


## Primera Entrega: Semántica Estructural, Maquetación Responsive y Versionamiento

En este primer avance se implementó la estructura base y la interfaz visual adaptativa del proyecto, asegurando semántica web, accesibilidad y diseño responsive sin que el sitio web deje de ser intuitivo. 


### Tecnologías Utilizadas

* HTML5: Para la estructura de las páginas
* CSS3: Parte visual del sitio web, incluyendo aniamaciones y efectos usando CSS Grid y Flexbox.
* Bootstrap 5: Componente de carrusel automático en la página de inicio y para página de detalle de los servicios. 
* Google Fonts: Fuentes Poppins y Caveat Brush. 
* Font Awesome 6.5: Iconografía vectorial.


### Páginas Desarrolladas

* `index.html`: Página de inicio con carrusel de imágenes, servicios destacados, y accesos rápidos.
* `catalogo.html` / `catalogo2.html`: Catálogo de servicios organizado en tarjetas y paginación.
* `galeria.html` / `galeria2.html`: Muestra de trabajos realizados con filtros visuales y paginación.
* `quienes-somos.html`: Información sobre el salón
* `contacto.html`: Formulario para agendar citas, mapa de ubicación e información de contacto.
* Páginas de detalle: Vistas individuales de servicios (`detalle-maquillaje-dia.html`, `detalle-cejas.html`, `detalle-keratinas.html`).


### Aspectos importantes

1. **Semántica HTML5:**
   * Uso estricto de etiquetas estructurales: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>` y `<footer>`.
   * Metadatos completos en `<head>`: `charset="UTF-8"`, `viewport`, `title` y `description`.
   * Imágenes con etiquetas `alt`, atributos de dimensiones y carga diferida (`loading="lazy"`).

2. **Formulario con validaciones nativas:**
   * Ubicado en `contacto.html`.
   * Validaciones HTML5 sin scripts: `required`, expresiones regulares con `pattern`, límites de fecha `min` y `max`, tipos `email` y `date`, y longitudes `minlength`/`maxlength`.

3. **Maquetación y Responsive:**
   * **CSS Grid:** Define la macro-estructura en el `body` (`grid-template-rows: auto 1fr auto`) y cuadrículas de contenido.
   * **Flexbox:** Utilizado en la barra de navegación, tarjetas de productos y botones.
   * **3 Breakpoints con Media Queries:**
     * `1024px`: Escritorio y pantallas medianas.
     * `768px`: Tablets y menú adaptable.
     * `480px`: Dispositivos móviles.


## Segunda Entrega: Interactividad con JavaScript, Consumo de Datos y Persistencia

En este segundo avance se incorporó JavaScript para transformar el sitio en una aplicación web interactiva. Se implementaron los 4 módulos solicitados: manejo dinámico del DOM, consumo asíncrono de datos con Fetch API, almacenamiento en el navegador y validaciones en tiempo real con feedback visual.


### Tecnologías y Herramientas Agregadas

* **JavaScript (ES6+):** Programación de eventos, funciones asíncronas (`async/await`), manipulación del DOM y lógica de negocio.
* **Fetch API:** Para solicitar y cargar datos externos en formato JSON de manera asíncrona.
* **Web Storage API:** Uso de `localStorage` y `sessionStorage` para guardar información en el navegador del usuario sin necesidad de una base de datos externa.
* **JSON (`data.json`):** Archivo con los datos iniciales de las reseñas y opiniones de las clientas.


### Archivos de JavaScript Desarrollados

* `Javascript/contacto.js`: Controla el formulario de citas, la validación campo por campo, el guardado de solicitudes, la edición de registros y la ventana modal con las solicitudes del usuario.
* `Javascript/resenas.js`: Carga las opiniones desde `data.json` con `fetch()`, gestiona el indicador de carga y errores HTTP, y permite a la clienta publicar o eliminar su propia reseña.
* `Javascript/catalogo.js`: Filtra los servicios en el catálogo por categoría (Maquillaje, Peinados, Cejas y pestañas, etc.) sin recargar la página.
* `Javascript/galeria.js`: Filtra los trabajos fotográficos por categoría y recuerda la última pestaña elegida mediante `sessionStorage`.


### Aspectos importantes (Cumplimiento de los 4 Módulos)

1. **Manipulación del DOM y Manejo de Eventos:**
   * Creación dinámica de elementos en pantalla (`createElement`, `replaceChildren`, `append`, `appendChild`) para mostrar tarjetas de solicitudes y reseñas sin refrescar la página.
   * Uso de `event.preventDefault()` en formularios y enlaces de filtros para evitar el comportamiento por defecto del navegador.
   * Eventos implementados: `submit` para guardar información, `click` para botones y modales, `input` para validar mientras se escribe y contar caracteres, `change` para menús desplegables y estrellas, y `blur` para validar al salir del campo.

2. **Consumo Asíncrono de Datos (Fetch API):**
   * Petición asíncrona a `data.json` utilizando `fetch()` junto con `async` y `await`.
   * Manejo de estados HTTP: control de respuestas exitosas (`200`), página no encontrada (`404`), caídas de servidor (`500+`) y errores de conexión a internet mediante bloques `try / catch`.
   * Indicador visual de carga (rueda giratoria con mensaje "Cargando opiniones...") y mensaje de error con botón de "Reintentar" si la petición falla.

3. **Persistencia en el Cliente (localStorage y sessionStorage):**
   * **`localStorage` en contacto:** Las citas guardadas (`solicitudes`) se almacenan como colecciones de objetos en formato JSON (`JSON.stringify` y `JSON.parse`). Si el usuario recarga o cierra el navegador, sus solicitudes siguen ahí y las puede consultar, editar o borrar.
   * **`localStorage` en reseñas:** Las opiniones creadas por el usuario (`resenasNuevas`) se guardan en el navegador y se combinan con las reseñas base.
   * **`sessionStorage` en galería:** Guarda la categoría seleccionada para que se mantenga activa durante la sesión de navegación.

4. **Validaciones Dinámicas de Negocio y Feedback Visual:**
   * Desactivación de la validación nativa del navegador (`novalidate`) para usar validación personalizada en tiempo real.
   * Feedback visual instantáneo: los campos cambian a borde rojo con fondo suave (`.invalido`) si tienen error, o borde verde (`.valido`) si están correctos.
   * Mensajes de error específicos debajo de cada campo (`.error-campo`), explicando claramente qué corregir (ej. número de teléfono con 10 dígitos que empiece por 3, mínimo 3 letras en el nombre, fecha válida, etc.).
   * Contador de caracteres interactivo para el mensaje (0/500), avisando cuando se llega al límite.
   * El botón de enviar solo procesa los datos si todos los campos pasan las reglas de validación, enfocando automáticamente el primer campo que tenga error.
