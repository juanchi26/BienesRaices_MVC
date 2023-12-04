
import { unlink } from "node:fs/promises"
import { validationResult } from "express-validator"
import { esVendedor, formatearFecha } from "../helpers/index.js"

import  { Categoria, Precio, Propiedad, Mensaje, Usuario} from  "../models/index.js"

const admin = async (req, res) => {
    //leer query string
    const { pagina: page } = req.query

    const regex = /^[1-9]$/        // ^ siempre inicia con numeros, $ siempre termina con numeros

    if(!regex.test(page)){
        return res.redirect("/mis-propiedades?pagina=1")
    }

    try{
        const { id } = req.usuario

        //limites y offset paginador
        const limit = 5 ;


        const offset = ((page * limit)- limit )


        const [propiedades, total] = await Promise.all([
            Propiedad.findAll(
                {
                    limit,
                    offset,
                    where:
                    { usuarioId : id },
                    include:[
                        { model: Categoria, as: 'categoria' },
                        { model: Precio, as: 'precio' },
                        { model: Mensaje}
                    ],
                
            }),
            Propiedad.count({where: {
                usuarioId : id
            }})
        ])

        

        res.render("propiedades/admin", {
            pagina: "Mis Propiedades",
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limit),
            page: Number(page),
            total,
            offset,
            limit
        })

    }catch(error){
        console.log(error)

    }



    
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
    
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect("/mis-propiedades")
    }

    res.render("propiedades/agregar-imagen", {
        pagina: `Agregar Imagenes a la Propiedad: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken()
    })
}

const almacenarImagen = async (req, res, next) => {
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
    
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect("/mis-propiedades")
    }

    try{
        console.log(req.file)
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()
        next()
        //almacenar la imagen y publicar propiedad

    }catch(error){
        console.log(error)
    }

}

const editar = async (req, res) => {

    const { id } = req.params

    //validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)


    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //revisar que el usuario sea el dueño de la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }


    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    res.render("propiedades/editar", {
        pagina: `Editar Propiedad: ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        precios,
        categorias,
        datos: propiedad
        
    })
}

const guardarCambios = async (req, res) => {

    //verificar la validacion

    const resultado = validationResult(req)

    

    if(!resultado.isEmpty()){

        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render("propiedades/editar", {
                    pagina: "Editar Propiedad",
                    csrfToken: req.csrfToken(),
                    precios,
                    categorias,
                    datos: req.body,
                    errores: resultado.array(),
                })
    }



    const { id } = req.params

    //validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)


    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //revisar que el usuario sea el dueño de la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }

    //reescribir el objeto u actualizarlo

    try{
        const { titulo, descripcion, habitaciones, wc, estacionamiento, calle, lat, lng, precio, categoria, _csrf  } = req.body

        propiedad.set({
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

        })

        await propiedad.save()
        res.redirect("/mis-propiedades")

    }catch (error) {
        console.log(error)
    }




}

const eliminar = async (req, res) => {

    const { id } = req.params

    //validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)


    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //revisar que el usuario sea el dueño de la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }

    //eliminar imagen

    await unlink(`public/uploads/${propiedad.imagen}`)

    console.log(`se elimino ${propiedad.imagen}`)

    //eliminar propiedad
    await propiedad.destroy()
    res.redirect("/mis-propiedades")

}


//MODIFICA EL ESTADO DE LA PROPIEDAD

const cambiarEstado = async (req, res) => {

    const { id } = req.params

    //validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id)


    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //revisar que el usuario sea el dueño de la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }


    //actualizar estado

    propiedad.publicado = !propiedad.publicado

    await propiedad.save()

    res.json({
        resultado: true
    })

}


//Muestra una propiedad

const mostrarPropiedad = async (req, res) => {
     
    const { id } = req.params

    //comprobar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Precio, as: "precio" },
            {model: Categoria, as: "categoria"}]
    })

    if(!propiedad || !propiedad.publicado){
        return res.redirect("/404")
    
    }

    

    res.render("propiedades/mostrar", {
        pagina: propiedad.titulo,
        propiedad,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}


const enviarMensaje = async (req, res) => {
    const { id } = req.params

    //comprobar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Precio, as: "precio" },
            {model: Categoria, as: "categoria"}]
    })

    if(!propiedad){
        return res.redirect("/404")
    
    }
    

    //renderizar los errores

    const resultado = validationResult(req)

    

    if(!resultado.isEmpty()){
        return  res.render("propiedades/mostrar", {
            pagina: propiedad.titulo,
            propiedad,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array(),
        })
        
    }

    //almacenar mensaje

    const { mensaje } = req.body
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario

    
    
    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    res.redirect("/")
}




//leer mensajes recibidos

const leerMensajes = async (req, res) => {

    const { id } = req.params

    //validar que la propiedad exista

    const propiedad = await Propiedad.findByPk(id,
        {
            include:[
                { model: Mensaje , 
                    include: [{model: Usuario.scope("eliminarPassword"), as: "usuario"}]}
                
            ]
        }
        )


    if(!propiedad){
        return res.redirect("/mis-propiedades")
    
    }

    //revisar que el usuario sea el dueño de la propiedad

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect("/mis-propiedades")
    }

    res.render("propiedades/mensajes", {
        pagina: "Mensajes Recibidos",
        mensajes: propiedad.Mensajes,
        formatearFecha,

    })
}


export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrarPropiedad,
    enviarMensaje,
    leerMensajes,
    
}