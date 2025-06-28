
$(document).ready(function (){

    const tcgdex = new TCGdex('en');

    imprimir();

    async function imprimir() {
        const expansion = await tcgdex.fetch('series','sv');
        console.log('INFORMACION DE LA SERIE ');
        console.log(expansion);
    }

});
    
