import { validationResult } from "express-validator"

import  { Categoria, Precio, Propiedad} from  "../models/index.js"

const admin = (req, res) => {
    res.render("propiedades/admin", {
        pagina: "Mis Propiedades",
    })
}


//formulario para listar una nueva propiedad
const crear = async(req, res) => {
    //consultar modelo de categorias y precios 

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render("propiedades/crear", {
        pagina: "Crear Propiedad",
        csrfToken: req.csrfToken(),
        precios,
        categorias,
        datos: {}
        
    })

}

const guardar = async (req, res) => {
    //validacion
    const resultado = validationResult(req)

    

    if(!resultado.isEmpty()){

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render("propiedades/crear", {
            pagina: "Crear Propiedad",
            csrfToken: req.csrfToken(),
            precios,
            categorias,
            errores: resultado.array(),
            datos: req.body

        })
    }

    //crear un registro

        const { titulo, descripcion, habitaciones, wc, estacionamiento, calle, lat, lng, precio, categoria, _csrf  } = req.body
        
        const { id: usuarioId } = req.usuario
        try{
            
            const propiedadGuardada = await Propiedad.create({
                titulo,
                descripcion,
                habitaciones,
                wc,
                estacionamiento,
                calle,
                lat,
                lng,
                precioId: precio,
                categoriaId: categoria,
                usuarioId,
                imagen: "",
                
                



            })
            const { id } = propiedadGuardada
            res.redirect(`/propiedades/agregar-imagen/${id}`)
        }catch(error){
            console.log(error)
        }


}

const agregarImagen = async (req, res) => {

    const { id } = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect("/mis-propiedades")
    }

    //validar que la propiedad pertenece a quien visita la pagina



    res.render("propiedades/agregar-imagen", {
        pagina: "Agregar Imagenes a la Propiedad",
    })
}






export {
    admin,
    crear,
    guardar,
    agregarImagen
}