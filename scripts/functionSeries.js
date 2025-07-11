$(document).ready(function()
{
    // Instanciar el SDK de Poke Api
    const tcgdex = new TCGdex('en');

    // esta funcion carga las series
    localStorage.setItem('idSerie', 'sv');
    getSeries()


    // esta funcion sirve para imprimir la informacion de la API(debug)
    async function imprimirSeries(params) 
    {
        const series = await tcgdex.fetch('series');
        console.log(series) 
    }



    async function getSeries(params) 
    {
        $("#list-series").append(
            '<p class="text-white h5">Cargando series...</p>'
        )

        try
        {
            // Obtener todas las series de cartas
            const series = await tcgdex.fetch('series');;
            console.log(series)
            
            $("#list-series").empty()

            for(let serie of series)
            {
                if(!serie.logo)
                {
                    $("#list-series").append
                    (
                        `<div class="row mb-4 mt-2 d-flex g-2 g-sm-0 align-items-center justify-content-center rounded-4 serie-hover" data-id=${serie.id}>

                            <div class="col-12 col-sm-3 text-center">
                                <!-- imagen de la serie -->
                                <span class="material-symbols-outlined rounded-4 d-inline iconSerie">bid_landscape_disabled</span>
                            </div>

                            <div class="col-12 col-sm-9 text-center text-md-start">
                                <!-- nombre de la serie -->
                                <p class="text-white m-0 h2 mb-1 d-inline">${serie.name}</p>
                            </div>
                            
                        </div>`
                    )
                }
                else
                {
                    $("#list-series").append
                    (
                        `<div class="row mb-4 d-flex g-2 g-sm-0 align-items-center justify-content-center rounded-4 serie-hover" data-id=${serie.id}>
    
                            <div class="col-12 col-sm-3 text-center">
                                <!-- imagen de la serie -->
                                <img class="rounded-4 d-inline imgSerie" src=${serie.logo}.png alt="">
                            </div>
    
                            <div class="col-12 col-sm-9 text-center text-md-start">
                                <!-- nombre de la serie -->
                                <p class="text-white m-0 h2 mb-1 d-inline">${serie.name}</p>
                            </div>
                    
                        </div>`
                    )

                }

            }
        }
        catch
        {
            $("#list-series").empty()

            console.error('Error al obtener las series de cartas:', error);

            $("#list-series").append(
                '<p class="text-white h5">Error al cargar las series. Por favor, inténtelo de nuevo.</p></p>'
            )
        }

        $(".serie-hover").click(function() 
        {
            window.location.href = "../pages/ExpansionSv.html";
            let idSerie = $(this).data("id");
            localStorage.setItem('idSerie', idSerie);

        });
    }
})

