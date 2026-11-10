
// Obtener referencias a los botones de filtro y las fotos
const seccionFotos = document.querySelector('.sectiongaleria-page');
const botonesFiltro = document.querySelectorAll('.nav-galeria a');
const fotos = document.querySelectorAll('.sectiongaleria-page figure');

// Agregar un evento de clic a cada botón de filtro
function aplicarFiltro(categoria) {
  fotos.forEach(function(foto) {
    const coincide = categoria === 'Todos' || foto.dataset.categoria === categoria;
    foto.style.display = coincide ? '' : 'none';
  });

  // Actualizar la clase activa en los botones de filtro
  botonesFiltro.forEach(function(b) {
    b.classList.toggle('activo', b.textContent.trim() === categoria);
  });

   seccionFotos.classList.toggle('filtrado', categoria !== 'Todos');
}

// Aplicar el filtro guardado en sessionStorage al cargar la página
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function(event) {
    event.preventDefault();
    const categoria = boton.textContent.trim();
    // sessionStorage permite guardar el filtro seleccionado para que se mantenga al recargar la página
    sessionStorage.setItem('filtroGaleria', categoria);
    aplicarFiltro(categoria);
  });
});

//Aplicar el filtro guardado en sessionStorage al cargar la página
aplicarFiltro(sessionStorage.getItem('filtroGaleria') || 'Todos');
