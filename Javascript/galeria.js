// referencias a los elementos del dom
const seccionFotos = document.querySelector('.sectiongaleria-page');
const botonesFiltro = document.querySelectorAll('.nav-galeria a');
const fotos = document.querySelectorAll('.sectiongaleria-page figure');

// funcion para filtrar las fotos segun la categoria
function aplicarFiltro(categoria) {
  fotos.forEach(function(foto) {
    // verifica si la foto coincide con la categoria seleccionada o si es 'Todos'
    const coincide = categoria === 'Todos' || foto.dataset.categoria === categoria;
    foto.style.display = coincide ? '' : 'none'; // oculta o muestra la foto
  });

  // activa visualmente el boton seleccionado
  botonesFiltro.forEach(function(b) {
    b.classList.toggle('activo', b.textContent.trim() === categoria);
  });

  // cambia la rejilla si hay un filtro aplicado
  seccionFotos.classList.toggle('filtrado', categoria !== 'Todos');
}

// agrega el evento clic a cada boton de categoria
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function(event) {
    event.preventDefault(); // evita el salto o recarga del enlace
    const categoria = boton.textContent.trim();

    // guarda la eleccion en sessionstorage para que persista durante la sesion
    sessionStorage.setItem('filtroGaleria', categoria);

    aplicarFiltro(categoria); // aplica el filtro inmediatamente
  });
});

// recupera los nombres de las categorias validas
const categoriasValidas = Array.from(botonesFiltro).map(function(b) {
  return b.textContent.trim();
});

// lee el filtro previo guardado en sessionstorage o usa 'Todos' por defecto
const guardado = sessionStorage.getItem('filtroGaleria');
aplicarFiltro(categoriasValidas.includes(guardado) ? guardado : 'Todos');
