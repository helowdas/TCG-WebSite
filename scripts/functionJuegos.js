// Script para cargar juegos relacionados al TCG desde Wikipedia y mostrarlos en tarjetas
async function cargarJuegosWikipedia() {
  const $contenedor = document.getElementById('listado-juegos');
  $contenedor.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Buscando juegos relacionados al TCG...</p></div>';
  try {
    // Buscar artículos en español relacionados con Pokémon TCG
    const url = 'https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=pokemon%20trading%20card%20game%20videojuego&format=json&origin=*';
    const resp = await fetch(url);
    const data = await resp.json();
    if (!data.query || !data.query.search || data.query.search.length === 0) {
      $contenedor.innerHTML = '<p class="text-center text-muted">No se encontraron juegos relacionados al TCG en Wikipedia.</p>';
      return;
    }
    $contenedor.innerHTML = '';
    data.query.search.forEach(juego => {
      const titulo = juego.title;
      const extracto = juego.snippet.replace(/(<([^>]+)>)/gi, "");
      const enlace = `https://es.wikipedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, '_'))}`;
      $contenedor.innerHTML += `
        <div class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 sombra-juego">
            <div class="card-body">
              <h5 class="card-title">${titulo}</h5>
              <p class="card-text">${extracto}...</p>
              <a href="${enlace}" target="_blank" class="btn btn-primary">Ver en Wikipedia</a>
            </div>
          </div>
        </div>
      `;
    });
  } catch (error) {
    $contenedor.innerHTML = '<p class="text-center text-danger">Error al cargar los juegos. Intenta de nuevo más tarde.</p>';
  }
}
document.addEventListener('DOMContentLoaded', cargarJuegosWikipedia); 