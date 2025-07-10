
// Función para obtener todas las expansiones de Scarlet & Violet
async function get_all_expansions_sv(tcgdex) {
    const svSeries = await tcgdex.fetch('series', 'sv');

    console.log("Series obtenida:", svSeries);

    // Las expansiones ya están disponibles en svSeries.sets
    const all_expansions = svSeries.sets;

    console.log("Expansiones obtenidas:", all_expansions);
    return all_expansions;
}

// Función para crear las tarjetas de las expansiones
function create_card_SV(expansion) {
    // Si es "Rivales Predestinados", crear tarjeta con enlace
    if (expansion.name === "Rivales Predestinados") {
        return `
            <div class="col-md-3 mb-3">
                <a href="Detail_DR.html" style="text-decoration: none; color: inherit;">
                    <div class="card h-100 card-expansion-modern position-relative overflow-hidden">
                        <img src="${expansion.logo}.webp" class="card-img-top card-expansion-img" alt="${expansion.name}">
                        <div class="expansion-overlay d-flex align-items-center justify-content-center">
                            <h5 class="card-title mb-0">${expansion.name}</h5>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }
    
    // Si no es "Rivales Predestinados", crear tarjeta sin enlace
    return `
        <div class="col-md-3 mb-3">
            <div class="card h-100 card-expansion-modern position-relative overflow-hidden">
                <img src="${expansion.logo}.webp" class="card-img-top card-expansion-img" alt="${expansion.name}">
                <div class="expansion-overlay d-flex align-items-center justify-content-center">
                    <h5 class="card-title mb-0">${expansion.name}</h5>
                </div>
            </div>
        </div>
    `;
}

async function cargarExpansiones(tcgdex) {
    try {
        // Obtengo todas las expansiones de Scarlet & Violet
        const all_expansions = await get_all_expansions_sv(tcgdex);

        console.log("Todas las expansiones de Scarlet & Violet");
        console.log(all_expansions);

        // Creo el HTML para todas las tarjetas de expansiones en orden inverso
        const svCardHtml = all_expansions.reverse().map(expansion => create_card_SV(expansion)).join('');
                    
        $('#expansions-grid').html(svCardHtml);
    } catch (error) {
        console.error("Error al cargar las expansiones:", error);
        $('#expansions-grid').html('<div class="col-12 text-center text-danger">No se pudieron cargar las expansiones.</div>');
    }
}

$(document).ready(function() {
    // Inicializo la api tcgdex
    const tcgdex = new TCGdex('es');



    // Llamo a la función asíncrona
    cargarExpansiones(tcgdex);
});
