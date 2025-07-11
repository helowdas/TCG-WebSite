$(document).ready(function() 
{
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

});