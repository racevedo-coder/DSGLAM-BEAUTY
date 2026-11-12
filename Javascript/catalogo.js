// referencias a los botones de filtro y a las tarjetas de servicios
const botonesFiltro = document.querySelectorAll('.nav-catalogo a');
const articulos = document.querySelectorAll('.sectionservicios article');

// recorre cada boton y asigna el evento clic
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function(event) {
    event.preventDefault(); // evita que el enlace recargue la pagina

    // obtiene el texto de la categoria clickeada
    const categoria = this.textContent.trim();

    // recorre cada articulo para mostrar u ocultar segun la categoria
    articulos.forEach(function(articulo) {
      const coincide = categoria === 'Todos' || articulo.dataset.categoria === categoria;
      articulo.style.display = coincide ? '' : 'none'; // vacio muestra, 'none' oculta
    });

    // quita la clase activo de todos los botones y se la asigna al seleccionado
    botonesFiltro.forEach(function(b) { b.classList.remove('activo'); });
    this.classList.add('activo');
  });
});
