import Sequelize from "sequelize"
import { Precio, Categoria, Propiedad } from "../models/index.js"

const inicio = async (req, res) => {
    const user = req.cookies.user
    const [categorias , precios, casas, departamentos, destacados ] = await Promise.all([
        Categoria.findAll({
            raw:true
        }),
        Precio.findAll({
            raw:true
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1,
                publicado: 1,
            },
            include:
            {
                model: Precio,
                as: "precio"
            },
            order: [
                ["createdAt", "DESC"]
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2,
                publicado: 1,
            },
            include:
            {
                model: Precio,
                as: "precio"
            },
            order: [
                ["createdAt", "DESC"]
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                destacado: 1,
                publicado: 1,
            },
            include:
            {
                model: Precio,
                as: "precio"
            },
            order: [
                ["createdAt", "DESC"]
            ]
        })

    ])


    res.render("inicio", {
        pagina: "Inicio",
        categorias,
        precios,
        user,
        casas,
        departamentos,
        destacados,
        csrfToken: req.csrfToken()
    })
}

const categoria = async (req, res) => {
    const { id } = req.params
    //comprobar que la categoria existe

    const categoria = await Categoria.findByPk(id)

    if(!categoria){
        return res.redirect("/404")
    }

    //obtener categoria existente

    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include:[
            { model: Precio, as: "precio" }
        ]
            
        
    })

    res.render("categoria", {
        pagina: `Categoria: ${categoria.nombre}`,
        propiedades,
        csrfToken: req.csrfToken()

    })


}

const noEncontrado = (req, res) => {

    res.render("404", {
        pagina: "No encontrada",
        csrfToken: req.csrfToken()
    })
}

const buscador = async (req, res) => {
    const { termino } = req.body


    //validar que termino no este vacio
    if(!termino.trim()){
        return res.redirect("back")
    
    }
    //consultar propiedades
    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like] : "%" + termino +"%"
            }
        },
        include: [
            { model: Precio, as: "precio" },
        ]
    })
    res.render("busqueda", {
        pagina: "Resultados de la busqueda",
        propiedades,
        csrfToken: req.csrfToken()
    })
}


export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}