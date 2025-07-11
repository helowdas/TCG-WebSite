
// Función para obtener información detallada de un set específico
async function get_set_info(tcgdex, setId) {
    try {
        const setInfo = await tcgdex.fetch('sets', setId);
        return setInfo;
    } catch (error) {
        console.error(`Error al obtener información del set ${setId}:`, error);
        return null;
    }
}

//? Función para obtener todas las expansiones con información detallada (optimizada)
//? anteriormente se hacia un foreach pero no era optimo haciendo que se cargue muy lento la pagina
async function get_all_expansions_sv_with_dates(tcgdex) {
    try {
        const svSeries = await tcgdex.fetch('series', 'sv');
        console.log("Series obtenida:", svSeries);

        const all_expansions = svSeries.sets;
        console.log("Expansiones obtenidas:", all_expansions.length);

        // Crear un array de promesas para cargar todas las fechas en paralelo
        const promises = all_expansions.map(async (expansion) => {
            try {
                const detailed_info = await get_set_info(tcgdex, expansion.id);
                return {
                    ...expansion,
                    releaseDate: detailed_info?.releaseDate || null
                };
            } catch (error) {
                console.error(`Error al obtener fecha para ${expansion.name}:`, error);
                return {
                    ...expansion,
                    releaseDate: null
                };
            }
        });

        // Esperar a que todas las promesas se resuelvan en paralelo
        const expansions_with_dates = await Promise.all(promises);
        console.log("Expansiones con fechas cargadas:", expansions_with_dates.length);

        return expansions_with_dates;
    } catch (error) {
        console.error("Error al obtener expansiones:", error);
        return [];
    }
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

// Función para ordenar expansiones alfabéticamente
function ordenar_alfabeticamente(expansiones) {
    return expansiones.sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

// Función para ordenar expansiones por fecha (más reciente a más antigua)
// usando el comparator como en POO 
function ordenar_fecha_reciente_antigua(expansiones) {
    return expansiones.sort((a, b) => {
        const fechaA = new Date(a.releaseDate);
        const fechaB = new Date(b.releaseDate);
        return fechaB - fechaA; // Más reciente primero
    });
}

// Función para ordenar expansiones por fecha (más antigua a más reciente)
// usando el comparator como en POO 
function ordenar_fecha_antigua_reciente(expansiones) {
    return expansiones.sort((a, b) => {
        const fechaA = new Date(a.releaseDate);
        const fechaB = new Date(b.releaseDate);
        return fechaA - fechaB; // Más antigua primero
    });
}

// Función para renderizar las expansiones ordenadas
function renderizar_expansiones_ordenadas(expansiones_ordenadas) {
    const svCardHtml = expansiones_ordenadas.map(expansion => create_card_SV(expansion)).join('');
    $('#expansions-grid').html(svCardHtml);
}

// Variable global para almacenar todas las expansiones
let todas_las_expansiones = [];

async function cargarExpansiones(tcgdex) {
    try {
        // Mostrar indicador de carga
        $('#expansions-grid').html('<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando expansiones...</p></div>');
        
        // Obtengo todas las expansiones de Scarlet & Violet con fechas de lanzamiento
        todas_las_expansiones = await get_all_expansions_sv_with_dates(tcgdex);

        console.log("Todas las expansiones de Scarlet & Violet con fechas:");
        console.log(todas_las_expansiones);

        // Por defecto, muestro las expansiones en orden inverso (más recientes primero)
        const expansiones_ordenadas = ordenar_fecha_reciente_antigua([...todas_las_expansiones]);
        renderizar_expansiones_ordenadas(expansiones_ordenadas);
        
        agregar_botones_ordenamiento();
        
    } catch (error) {
        console.error("Error al cargar las expansiones:", error);
        $('#expansions-grid').html('<div class="col-12 text-center text-danger">No se pudieron cargar las expansiones.</div>');
    }
}

// Función para agregar botones de ordenamiento
function agregar_botones_ordenamiento() {
    const botonesHtml = `
        <div class="row mb-4">
            <div class="col-12 text-center">
                <div class="btn-group" role="group" aria-label="Opciones de ordenamiento">
                    <button type="button" class="btn btn-outline-primary" id="btn-alfabetico">Alfabético</button>
                    <button type="button" class="btn btn-outline-primary" id="btn-reciente-antigua">Más Reciente</button>
                    <button type="button" class="btn btn-outline-primary" id="btn-antigua-reciente">Más Antigua</button>
                </div>
            </div>
        </div>
    `;
    
    // Insertar los botones antes del grid de expansiones
    $('#expansions-grid').before(botonesHtml);
    
    $('#btn-alfabetico').click(function() {
        const expansiones_ordenadas = ordenar_alfabeticamente([...todas_las_expansiones]);
        renderizar_expansiones_ordenadas(expansiones_ordenadas);
        actualizar_estado_botones('alfabetico');
    });
    
    $('#btn-reciente-antigua').click(function() {
        console.log("Botón Más Reciente clickeado");
        const expansiones_ordenadas = ordenar_fecha_reciente_antigua([...todas_las_expansiones]);
        renderizar_expansiones_ordenadas(expansiones_ordenadas);
        actualizar_estado_botones('reciente-antigua');
    });
    
    $('#btn-antigua-reciente').click(function() {
        console.log("Botón Más Antigua clickeado");
        const expansiones_ordenadas = ordenar_fecha_antigua_reciente([...todas_las_expansiones]);
        renderizar_expansiones_ordenadas(expansiones_ordenadas);
        actualizar_estado_botones('antigua-reciente');
    });
    
    // Marcar el botón por defecto como activo
    actualizar_estado_botones('reciente-antigua');
}

// Función para actualizar el estado visual de los botones
function actualizar_estado_botones(tipo_ordenamiento) {
    // Remover clase activa de todos los botones
    $('.btn-group .btn').removeClass('btn-primary').addClass('btn-outline-primary');
    
    // Agregar clase activa al botón seleccionado
    switch(tipo_ordenamiento) {
        case 'alfabetico':
            $('#btn-alfabetico').removeClass('btn-outline-primary').addClass('btn-primary');
            break;
        case 'reciente-antigua':
            $('#btn-reciente-antigua').removeClass('btn-outline-primary').addClass('btn-primary');
            break;
        case 'antigua-reciente':
            $('#btn-antigua-reciente').removeClass('btn-outline-primary').addClass('btn-primary');
            break;
    }
}

$(document).ready(function() {
    try {
        // Inicializo la api tcgdex
        const tcgdex = new TCGdex('es');
        
        cargarExpansiones(tcgdex);
    } catch (error) {
        console.error("Error al inicializar TCGdex:", error);
        $('#expansions-grid').html('<div class="col-12 text-center text-danger">Error al cargar la API. Por favor, recarga la página.</div>');
    }
});
