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

---

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
