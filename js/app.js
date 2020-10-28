const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

//en este objeto voy a ir llenando los options seleccionados para la petición a la API
const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}


//crear promise
const obtenerCriptomonedas = (criptomonedas) => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit',submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor); //cuando haga click en otra cripto llamo a la fn leer valor
    monedaSelect.addEventListener('change', leerValor); //cuando haga click en otra moneda llamo a la fn leer valor
})

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    /* fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data)) //llamo obtenerCriptomonedas que es una promesa
        .then(criptomonedas => selectCriptomonedas(criptomonedas)); //recibo el resolve de obtenerCriptomonedas y llamo a selectCriptomonedas que es igual a ->  .then(resultado => {const criptomonedas = resultado.Data;criptomonedasSelect(criptomonedas);})
 */  try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);
    } catch (error) {
        console.log(error);    
    }
        


}

function selectCriptomonedas(criptomonedas) { //itero al objeto de criptomonedas
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo; //desctrucutring
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
//console.log(e.target.name); //me dice el tipo de select con el que trato, si es cripto o una moneda
//console.log(e.target.value); //me dice el valor del option
    objBusqueda[e.target.name]= e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();
    //validar
    const {moneda,criptomoneda}= objBusqueda;

    if(moneda==='' || criptomoneda ===''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje){
    const divMensaje = document.createElement('div');
    const error = document.querySelector('.error');

    if(!error){
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje; //mensaje error
        formulario.appendChild(divMensaje);
        setTimeout(()=>{
            divMensaje.remove();
        },3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner(); //llamamos al spinner de carga

   /*  fetch(url)
        .then(respuesta=>respuesta.json())
        .then(cotizacion =>{
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        }); */
    try {
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]); 
    } catch (error) {
        console.log(error);
    }

}

function mostrarCotizacionHTML(cotizacion){
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion; //extraemos los datos de la respuesta de la api
    limpiarHTML(); //limpio antes de imprimir
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
    El precio es:<span> ${PRICE}</span>
    `
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día:<span> ${HIGHDAY}</span>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día:<span> ${LOWDAY}</span>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variación últimas 24 horas:<span> ${CHANGEPCT24HOUR}%</span>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualización:<span> ${LASTUPDATE}</span>`

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner') //https://tobiasahlin.com/spinkit/
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);

}