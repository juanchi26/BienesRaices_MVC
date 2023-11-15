(function() {
    const lat = document.querySelector("#lat").value || -34.5245598;
    const lng = document.querySelector("#lng").value || -56.2816317;
    const mapa = L.map('mapa').setView([lat, lng ], 14);
    let marker

    //utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService(); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //pin 

    marker = L.marker([lat, lng],{
        draggable: true,
        autoPan: true,

    }).addTo(mapa);

    //detectar el movimiento del pin 
    marker.on('moveend', function(e){
        marker = e.target;
        const posicion = marker.getLatLng();
        console.log(posicion);
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))


        //obtener info de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,14).run(function(error, resultado){
            marker.bindPopup(resultado.address.Address)

            //llenar los campos
            document.querySelector(".calle").textContent = resultado.address.Address ?? "";
            document.querySelector("#calle").value = resultado.address.Address ?? ""
            document.querySelector("#lat").value = resultado.latlng.lat ?? ""
            document.querySelector("#lng").value = resultado.latlng.lng ?? ""
        })
    })

    


})()