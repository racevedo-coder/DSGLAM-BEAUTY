// Seleccionamos todos los botones de filtro en el catálogo
const botonesFiltro = document.querySelectorAll('.nav-catalogo a');
const articulos = document.querySelectorAll('.sectionservicios article');

// Agregamos un evento de clic a cada botón de filtro
botonesFiltro.forEach(function(boton) {
  // Agregamos un evento de clic al botón
  boton.addEventListener('click', function(event) {
    event.preventDefault(); // Evitar que la página recargue

    // Obtener la categoría del botón clicado
    const categoria = this.textContent.trim();

    // Mostrar u ocultar los artículos según la categoría seleccionada
     articulos.forEach(function(articulo) {
     const coincide = categoria === 'Todos' || articulo.dataset.categoria === categoria;
      articulo.style.display = coincide ? '' : 'none';
        
    });

    // Actualizar la clase activa en los botones de filtro
    botonesFiltro.forEach(function(b) { b.classList.remove('activo'); });
    this.classList.add('activo'); // Agregar la clase 'activo' al botón clicado
  });
});