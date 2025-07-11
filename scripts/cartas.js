$(document).ready(function () {
  const tcgdex = new TCGdex('es');

  let todasLasCartas = [];
  let cartasFiltradas = [];
  let paginaActual = 0;
  const cartasPorPagina = 12;

  const $contenedor = $("#cartas-container");
  const $selectRareza = $("#filtro-rareza");

  $selectRareza.on("change", aplicarFiltroRareza);

  async function obtenerCartasConRareza(ids) {
    const resultados = [];
    for (const id of ids) {
      try {
        const carta = await tcgdex.fetch("cards", id);
        resultados.push({
          id: carta.id,
          name: carta.name,
          image: `${carta.image}/high.png`,
          rarity: carta.rarity || "Sin rareza"
        });
      } catch (error) {
        console.warn(`No se pudo cargar la carta con ID: ${id}`);
      }
    }
    return resultados;
  }

  async function cargarCartas() {
    try {
      const expansion = await tcgdex.fetch("sets", "sv10");
      const ids = expansion.cards.map(c => c.id);
      todasLasCartas = await obtenerCartasConRareza(ids);
      activarFiltroRareza(todasLasCartas);
      cartasFiltradas = todasLasCartas;
      mostrarCartasPaginadas();
    } catch (error) {
      console.error("Error al cargar cartas:", error);
      $contenedor.html("<p class='text-danger text-center'>Error al cargar las cartas.</p>");
    }
  }


  function activarFiltroRareza(cartas) {
    console.log("✅ activando filtro con cartas:", cartas); 

    const rarezas = new Set();

    cartas.forEach(carta => {
      if (carta.rarity) {
        rarezas.add(carta.rarity);
      }
    });

    $selectRareza.html('<option value="">Rareza</option>');
    rarezas.forEach(rareza => {
      $selectRareza.append(`<option value="${rareza}">${rareza}</option>`);
    });

    $selectRareza.prop("disabled", false);
  }


  function crearTarjetaCarta(carta) {
    return `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${carta.image}" class="card-img-top" alt="${carta.name}">
          <div class="card-body">
            <h5 class="card-title text-center">${carta.name}</h5>
          </div>
        </div>
      </div>
    `;
  }

  function mostrarCartasPaginadas() {
    $contenedor.empty();

    const inicio = paginaActual * cartasPorPagina;
    const fin = inicio + cartasPorPagina;
    const pagina = cartasFiltradas.slice(inicio, fin);

    if (pagina.length === 0) {
      $contenedor.html("<p class='text-muted text-center'>No hay cartas para mostrar.</p>");
      return;
    }

    const fila = $('<div class="row justify-content-center"></div>');
    pagina.forEach(carta => fila.append(crearTarjetaCarta(carta)));
    $contenedor.append(fila);

    crearPaginacion();
  }

  function crearPaginacion() {
    const totalPaginas = Math.ceil(cartasFiltradas.length / cartasPorPagina);
    const $paginacion = $("#pagination");
    $paginacion.empty(); // Limpia botones anteriores

    for (let i = 0; i < totalPaginas; i++) {
      const $btn = $(`<button>${i + 1}</button>`);
      if (i === paginaActual) $btn.addClass("active");

      $btn.on("click", () => {
        paginaActual = i;
        mostrarCartasPaginadas();
      });

      $paginacion.append($btn);
    }
  }


  function aplicarFiltroRareza() {
    const rarezaSeleccionada = $selectRareza.val();

    if (!rarezaSeleccionada) {
      cartasFiltradas = todasLasCartas;
    } else {
      cartasFiltradas = todasLasCartas.filter(carta => carta.rarity === rarezaSeleccionada);
    }

    paginaActual = 0;
    mostrarCartasPaginadas();
  }

  $selectRareza.on("change", aplicarFiltroRareza);

  cargarCartas();
});
