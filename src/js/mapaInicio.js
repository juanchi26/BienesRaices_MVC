(function(){
    const lat = -34.5245598;
    const lng = -56.2816317;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 14);

    let markers = new L.FeatureGroup().addTo(mapa);

    
    const categorias = document.querySelector('#categorias')
    const precios = document.querySelector('#precios')

    let propiedades = []

    categorias.addEventListener('change', e => {
        filtros.categoria = +e.target.value
        filtrarPropiedades()
    })

    precios.addEventListener('change', e => {
        filtros.precio = +e.target.value
        filtrarPropiedades()
    })
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //filtros
    const filtros = {
        categoria: "",
        precio: "",
    }

    const obtenerPropiedades = async () => {
        try{
            const url = 'api/propiedades'
            const respuesta = await fetch(url)
            propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
        }catch(error){
            console.log(error)
        }
    }

    const mostrarPropiedades = (propiedades) => {
        //limpiar los markers 
        markers.clearLayers()


        propiedades.forEach(propiedad => {
            
            //agregar pines
            const marker  = new L.marker([propiedad?.lat, propiedad?.lng],{autoPan: true})
            .addTo(mapa)
            .bindPopup(`
                <h1 class="text-md font-extrabold uppercase my-4">${propiedad?.titulo}</h1>
                <img src=/uploads/${propiedad?.imagen} alt="Imagen de la propiedad ${propiedad?.titulo}" class="rounded-md h-16">
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre} </p>
                <p class="text-gray-600 font-bold">${propiedad.precio.precio} </p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 p-2 block text-center linkText rounded-md font-bold">Ver ${propiedad.categoria.nombre}</a>
                
            
            `)

            markers.addLayer(marker)
        })
    }

    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad
    

    

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria)
        .filter(filtrarPrecio)
        mostrarPropiedades(resultado)
    }

    


    obtenerPropiedades()
})()