$(document).ready(function(){

    //? inicializar el cliente 
    const tcgdex = new TCGdex('es');

    
    //? Funcion para cargar los detalles de una carta 

    async function loadCardDetails(card_id) {
        
        $('#selected-card').html('<p class="text-center text-muted">Cargando detalles de la carta...</p>');
        $('#related-cards-list').html('<p class="text-center text-muted">Cargando cartas relacionadas...</p>');


        try{
            const card = await tcgdex.fetch('cards',card_id);
            //const imageUrl = card.logo;
            console.log(card)

            let cardHtml = `
                        <div class="card border-0"> 
                            <div class="row g-0">
                                <div class="col-md-5 d-flex align-items-center justify-content-center p-3">
                                    <img src="${card.image}/high.webp" class="img-fluid" alt="Imagen de ${card.name}">
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body p-4">
                                        <h5 class="card-title">${card.name}</h5>
                                        <p class="card-text"><strong>HP:</strong> ${card.hp || 'N/A'}</p>
                                        <p class="card-text"><strong>Tipo:</strong> ${card.types ? card.types.join(', ') : 'N/A'}</p>
                                        <p class="card-text"><strong>Expansión:</strong> ${card.set ? card.set.name : 'N/A'}</p>
                                        <p class="card-text"><strong>Rareza:</strong> ${card.rarity || 'N/A'}</p>
                                        <p class="card-text"><strong>Ilustrador:</strong> ${card.illustrator || 'N/A'}</p>

                                        ${card.abilities && card.abilities.length > 0 ? `
                                            <h6 class="mt-4 mb-2 text-primary">Habilidades:</h6>
                                            ${card.abilities.map(ability => `
                                                <div class="ability">
                                                    <h5>${ability.name}</h5>
                                                    <p>${ability.effect}</p>
                                                </div>
                                            `).join('')}` : ''}
                                        
                                        ${card.moves && card.moves.length > 0 ? `
                                            <h6 class="mt-4 mb-2 text-primary">Ataques:</h6>
                                            ${card.moves.map(attack => `
                                                <div class="attack">
                                                    <h5>${attack.name} (${attack.cost ? attack.cost.join(', ') : 'N/A'})</h5>
                                                    ${attack.damage ? `<p>Daño: ${attack.damage}</p>` : ''}
                                                    <p>${attack.effect || 'N/A'}</p>
                                                </div>
                                            `).join('')}` : ''}
                                        
                                        ${card.weaknesses && card.weaknesses.length > 0 ? `
                                            <p class="card-text mt-3"><strong>Debilidad:</strong> ${card.weaknesses.map(weakness => `${weakness.type} ${weakness.value}`).join(', ')}</p>
                                        ` : ''}
                                        ${card.resistances && card.resistances.length > 0 ? `
                                            <p class="card-text"><strong>Resistencia:</strong> ${card.resistances.map(resistance => `${resistance.type} ${resistance.value}`).join(', ')}</p>
                                        ` : ''}
                                        ${card.retreat ? `<p class="card-text"><strong>Coste de Retirada:</strong> ${card.retreat}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $('#selected-card').html(cardHtml);

                    // Si la carta tiene información de set, carga las cartas relacionadas
                    if (card.set && card.set.id) {
                        loadRelatedCards(card.set.id, card.id);
                    } else {
                        $('#related-cards-list').html('<p class="text-center text-muted">No se encontró información de expansión para cartas relacionadas.</p>');
                    }

        }catch(error){
            // ?Manejo de errores en caso de que la API falle o la carta no se encuentre
                    console.error("Error al cargar los detalles de la carta:", error);
                    let errorMessage = '<p class="text-center text-danger">Error al cargar los detalles de la carta. Inténtalo de nuevo más tarde.</p>';
                    if (error.status === 404) {
                        errorMessage = `<p class="text-center text-danger">La carta con ID "${card_id}" no fue encontrada. No es una carta válida de Escarlata y Púrpura.</p>`;
                    } else if (error.message && error.message.includes("is not found")) {
                        errorMessage = `<p class="text-center text-danger">La carta con ID "${card_id}" no fue encontrada. Por favor, verifica el ID.</p>`;
                    }
                    $('#selected-card').html(errorMessage);
                    $('#related-cards-list').html(''); // Limpia la lista de relacionadas
        }
    }

    // --- Función para cargar cartas relacionadas de una expansión ---
            async function loadRelatedCards(setId, currentCardId) {
                try {
                    // Usa el SDK para obtener la información completa del set
                    const set = await tcgdex.fetch('sets', setId); 

                    // Filtra las cartas del set: excluye la carta actual y solo incluye las que tienen imagen y nombre
                    const relatedCards = set.cards.filter(c => c.id !== currentCardId && c.image && c.name);

                    let relatedCardsHtml = '';
                    if (relatedCards.length > 0) {
                        // Limita el número de cartas relacionadas para un rendimiento óptimo
                        // Puedes ajustar este límite (ej. 15, 20) según tus necesidades
                        const limitedRelatedCards = relatedCards.slice(0, 15); 
                        relatedCardsHtml = limitedRelatedCards.map(c => {
                            const relatedImageUrl = c.image; // La URL de la imagen ya viene del SDK
                            return `
                                <div class="card">
                                    <img src="${relatedImageUrl}/high.png" class="card-img-top" alt="Imagen de ${c.name}" loading="lazy">
                                    <div class="card-body">
                                        <p class="card-text">${c.name}</p>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        relatedCardsHtml = '<p class="text-center text-muted w-100">No se encontraron otras cartas en esta expansión.</p>';
                    }
                    $('#related-cards-list').html(relatedCardsHtml);
                } catch (error) {
                    console.error("Error al cargar las cartas relacionadas:", error);
                    $('#related-cards-list').html('<p class="text-center text-danger w-100">Error al cargar las cartas relacionadas.</p>');
                }
            }

            // --- Función principal para iniciar la carga de la carta aleatoria ---
            async function initRandomScarletVioletCard() {
                try {
                    // Obtener la información de la serie Escarlata y Púrpura (ID 'sv')
                    const svSeries = await tcgdex.fetch('series', 'sv');

                    if (!svSeries || !svSeries.sets || svSeries.sets.length === 0) {
                        $('#selected-card').html('<p class="text-center text-danger">No se encontraron sets para la serie Escarlata y Púrpura.</p>');
                        return;
                    }

                    // Filtrar sets que no tengan un número total de cartas (posibles errores de datos)
                    const validSvSets = svSeries.sets.filter(set => set.cardCount && set.cardCount.total > 0);

                    if (validSvSets.length === 0) {
                        $('#selected-card').html('<p class="text-center text-danger">No se encontraron sets válidos en la serie Escarlata y Púrpura con cartas.</p>');
                        return;
                    }

                    // Seleccionar un set aleatorio de la serie Escarlata y Púrpura
                    const randomSetIndex = Math.floor(Math.random() * validSvSets.length);
                    const randomSet = validSvSets[randomSetIndex];
                    
                    // Obtener los detalles completos de ese set aleatorio para acceder a sus cartas
                    const fullRandomSet = await tcgdex.fetch('sets', randomSet.id); // Corregido: Usar tcgdex.fetch('sets', idDelSet)

                    if (!fullRandomSet || !fullRandomSet.cards || fullRandomSet.cards.length === 0) {
                        $('#selected-card').html(`<p class="text-center text-danger">No se encontraron cartas en el set aleatorio: ${randomSet.name}.</p>`);
                        return;
                    }

                    // Filtrar cartas que no tengan ID o imagen (para evitar errores al renderizar)
                    const playableCards = fullRandomSet.cards.filter(c => c.id && c.image);

                    if (playableCards.length === 0) {
                        $('#selected-card').html(`<p class="text-center text-danger">El set ${randomSet.name} no contiene cartas válidas para mostrar.</p>`);
                        return;
                    }

                    // Seleccionar una carta aleatoria de ese set
                    const randomCardIndex = Math.floor(Math.random() * playableCards.length);
                    const randomCard = playableCards[randomCardIndex];

                    // Cargar los detalles de la carta aleatoria
                    loadCardDetails(randomCard.id);

                } catch (error) {
                    console.error("Error al inicializar la carta aleatoria de Escarlata y Púrpura:", error);
                    $('#selected-card').html('<p class="text-center text-danger">Error al cargar una carta aleatoria de Escarlata y Púrpura. Inténtalo de nuevo más tarde.</p>');
                    $('#related-cards-list').html('');
                }
            }

            // Inicia el proceso para cargar una carta aleatoria de Escarlata y Púrpura al cargar la página
            initRandomScarletVioletCard();










});