(function(){
    
    const cambiarEstadoBotones = document.querySelectorAll(".destacado")
    const token = document.querySelector("[name=csrf-token]").content

   cambiarEstadoBotones.forEach(boton => {
    boton.addEventListener("click", cambiarDestacado)
   })

   async function cambiarDestacado (e){
        const { propiedadId: id } = e.target.dataset
        const URL = `/propiedades/${id}`
        try{
            const respuesta = await fetch(URL, {
                method: "PATCH",
                headers:{
                    "CSRF-Token" : token,
                }
                
            })
            const { resultado } = await respuesta.json()
            
            if(resultado){
                if(e.target.classList.contains("bg-gray-200")){
                    e.target.classList.remove("bg-gray-200", "text-gray-800")
                    e.target.classList.add("bg-orange-200", "text-orange-800")
                    e.target.textContent = "Destacado"
                }else{
                    e.target.classList.remove("bg-orange-200", "text-orange-800")
                    e.target.classList.add("bg-gray-200", "text-gray-800")
                    e.target.textContent = "No Destacado"
                }
                
            }
        }catch(error){
            console.log(error)
        }


   }

})()