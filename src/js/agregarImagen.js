import { Dropzone } from "dropzone"

const token = document.querySelector(`meta[name="csrf-token"]`).content

Dropzone.options.imagen = {
    dictDefaultMessage: "Sube tus imágenes aquí",
    acceptedFiles: ".jpg, .png, .jpeg",
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads:1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Eliminar",
    dictMaxFilesExceeded: "Puedes subir maximo 5 fotos",
    headers: {
        "csrf-token": token
    },
    paramName: "imagen",
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector("#publicar")
        btnPublicar.addEventListener("click", function(){
            dropzone.processQueue()
        
        })

        dropzone.on("queuecomplete", function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = "/mis-propiedades"
            }
        
        })
    }
}