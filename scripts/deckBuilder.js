var series = []
var expansions = []
var cards = []

var $BtnBuild = $("#botonDeck");

const maxDeck = 60;

var trainers = 0;
var energies = 0;
var pokemons = 0;
var deck = 0;

 // Instanciar el SDK de Poke Api
const tcgdex = new TCGdex('en');


$(document).ready(function() 
{

    // cargar data de la API
    getSeries();
    

    // funciones desplegar filtros
    $("#botonDrop").click(function() 
    {
        var boton = $(this);

        $("#slidefilters").slideToggle(300, function() 
        {
            if ($("#slidefilters").is(":visible")) 
            {
                boton.html('<i class="bi bi-caret-up-fill"></i> Expansiones');
            } else 
            {
                boton.html('<i class="bi bi-caret-down-fill"></i> Expansiones');
            }
        });
    });


    //funciones para filtros Deck Builder
    // Eventos de los botones de seccion
    $("#deckFilters .list-group-item").click(function() 
    {
        $("#deckFilters .list-group-item").removeClass("active");
        $(this).addClass("active");

        //extraer texto del botón
        let buttonText = $(this).text();


        if(buttonText === "Personajes")
        {
            
        }
        else if(buttonText === "Películas")
        {
            
        }
        else
        {
            
        }
    });

    //funcion para generar el deck
    $("#botonDeck").click(function()
    {
        generarDeck();
    });

    async function getSeries(params) 
    {
        series = await tcgdex.fetch('series');
        console.log(series)
        await getExpansions();
    }

    async function getExpansions(params) 
    {
        for(serie of series)
        {
            let serieOne = await tcgdex.fetch('series', serie.id);
            expansions.push(serieOne.sets);
        }
        
        await getCards();
        await cargarFiltros();
    }

    async function getCards()
    {
        for(expansion of expansions)
        {
            for(set of expansion)
            {
                let setOne = await tcgdex.fetch('sets', set.id);
                cards.push(setOne);
            }
        }
        console.log(expansions);
        console.log(cards);

    }

    async function cargarFiltros(params) 
    {
        let idserie = 0;
        let idFiltro = 0;
        let $seccionFiltros = $("#filtrosExpansiones");

        for(serie of series)
        {
            $seccionFiltros.append
            (
                `<div class="row text-center" id="serie${idserie}">
                        <!-- titulo de serie de las expansiones -->
                        <div class="col-12">
                            <p class="fw-bold fs-5">${serie.name}</p>
                        </div>
                </div>`
            )

            for(expansion of expansions[idserie])
            {
                $(`#serie${idserie}`).append
                (
                    `<div class="col-3 col-md-2 mb-1">
                            <input type="checkbox" id="filtro${idFiltro}"> 
                            <label for="filtro${idFiltro}" class="form-label p-0 m-0">${expansion.name}</label>
                    </div>`
                )

                idFiltro++;
                
            }

            $(`#serie${idserie}`).append
                (
                    `<hr>`
                )

            idserie++;
        }




        $BtnBuild.prop("disabled", false);
    }

    
    //funciones para generar el deck
    async function generarDeck() 
    {
        $("#deck-cards").empty(); // Limpiar el contenedor de cartas del deck
        
        $BtnBuild.prop("disabled", true);
        trainers = 0;
        energies = 0;
        pokemons = 0;
        deck = 0;

        $('#deck-count').text(`Deck Count: ${deck}/60`);
        $('#energies-count').text(`Pokemons (${pokemons})`);
        $('#trainer-count').text(`Trainers (${trainers})`);
        $('#pokemon-count').text(`Energies (${energies})`);

        for(let i = 0; deck < 60; i++)
        {

            let lenExpansiones = cards.length;
    
            //elegir una expansion al azar
            let expansion = Math.floor(Math.random() * lenExpansiones);
    
            //elegir una card al azar
            let lenCardsNum = cards[expansion].cardCount.total;
            let Numcard = Math.floor(Math.random() * lenCardsNum);
    
            //guardar la carta aleatoria escogida
            let card = cards[expansion].cards[Numcard];
            if(!card) 
            {
                continue; // Si no hay carta, saltar a la siguiente iteración
            }
            const cardInfo = await tcgdex.fetch('cards', card.id);


            cargarCard(card, cardInfo.category);

        }


        $BtnBuild.prop("disabled", false);
    }

    function cargarCard(card, category) 
    {

        var $deckCount = $("#deck-count"); //0/60
        var $pokemonCount = $("#pokemon-count"); //(0)
        var $trainerCount = $("#trainer-count"); //(0)
        var $energiesCount = $("#energies-count"); //(0)

        //cargar carta en el deck
        $("#deck-cards").append
        (
            `<div class="col-6 col-sm-4 col-lg-3 mb-4 ">
                    <div class="card p-0">
                        <!-- cuerpo de la card -->
                        <div class="card-body p-0">
                            <!-- imagen -->
                            <div class="col-12">
                                <img class="img-fluid" src='${card.image}/high.webp' alt="">
                            </div>
                        </div>
                    </div>
            </div>`
        )


        //contar que tipo de carta es
        if(category === "Pokemon")
        {
            pokemons++;
            $pokemonCount.text(`Pokemons (${pokemons})`);
        }
        else if(category === "Trainer")
        {
            trainers++;
            $trainerCount.text(`Trainers (${trainers})`);
        }
        else if(category === "Energy")
        {
            energies++;
            $energiesCount.text(`Energies (${energies})`);
        }

        deck = pokemons + trainers + energies;
        $deckCount.text(`Deck Count: ${deck}/60`);
    }
});
