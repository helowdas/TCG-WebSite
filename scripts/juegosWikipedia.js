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
    // Palabras clave para identificar videojuegos
    const palabrasClave = [
      'videojuego', 'juego', 'Game Boy', 'Trading Card Game', 'TCG', 'Nintendo', 'Online', 'Pocket', 'Gameboy'
    ];
    // Palabras a excluir (empresas, franquicia, temas generales)
    const excluir = [
      'empresa', 'compañía', 'franquicia', 'serie de anime', 'película', 'personaje', 'desarrolladora', 'editorial', 'Pokémon (franquicia)', 'Pokémon Company', 'Pokémon (empresa)', 'serie de videojuegos', 'anexo:', 'televisión'
    ];
    const juegosFiltrados = data.query.search.filter(juego => {
      const titulo = juego.title.toLowerCase();
      const extracto = juego.snippet.toLowerCase();
      // Excluir si el título es exactamente 'pokémon'
      if (titulo.trim() === 'pokémon') return false;
      // Debe contener alguna palabra clave
      const esJuego = palabrasClave.some(palabra => titulo.includes(palabra.toLowerCase()) || extracto.includes(palabra.toLowerCase()));
      // No debe contener palabras de exclusión
      const esExcluido = excluir.some(palabra => titulo.includes(palabra.toLowerCase()) || extracto.includes(palabra.toLowerCase()));
      return esJuego && !esExcluido;
    });
    if (juegosFiltrados.length === 0) {
      $contenedor.innerHTML = '<p class="text-center text-muted">No se encontraron juegos específicos del TCG en Wikipedia.</p>';
      return;
    }
    juegosFiltrados.forEach(juego => {
      const titulo = juego.title;
      const extracto = juego.snippet.replace(/(<([^>]+)>)/gi, "").slice(0, 120);
      const enlace = `https://es.wikipedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, '_'))}`;
      $contenedor.innerHTML += `
        <div class=\"col-md-6 col-lg-4 mb-4\">
          <div class=\"card juego-card h-100\">
            <div class=\"card-body d-flex flex-column justify-content-between\">
              <h5 class=\"card-title\">${titulo}</h5>
              <p class=\"card-text\">${extracto}...</p>
              <a href=\"${enlace}\" target=\"_blank\" class=\"btn btn-primary mt-auto\">Ver en Wikipedia</a>
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