
$(document).ready(function (){

    const tcgdex = new TCGdex('en');

    imprimir_serie();

    imprimir_destinatedRivals();

    async function imprimir_serie() {
        const expansion = await tcgdex.fetch('series','sv');
        console.log('INFORMACION DE LA SERIE ');
        console.log(expansion);
    }

    async function imprimir_destinatedRivals() {
        const svSeries = await tcgdex.fetch('series','sv');

        const destinedRivalsSet = svSeries.sets.find(set => set.name === "Destined Rivals" || set.id === "sv10");
        console.log('RIVALES PREDESTINADOS CARTAS')
        console.log(destinedRivalsSet);
    }

});
    
