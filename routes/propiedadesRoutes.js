import express from "express";
import { body } from "express-validator"
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, mostrarPropiedad } from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js"
import uploads from "../middleware/subirImagen.js"
const router = express.Router();


router.get("/mis-propiedades",protegerRuta, admin )
router.get("/propiedades/crear",protegerRuta, crear )
router.post("/propiedades/crear",protegerRuta, 
    body("titulo").notEmpty().withMessage("El titulo del Anuncio es Obligatorio"),
    body("descripcion")
        .notEmpty().withMessage("La Descripción no puede ir vacia")
        .isLength({max: 300}).withMessage("La Descripción no puede exceder los 300 caracteres"),
    body("categoria").isNumeric().withMessage("Selecciona una Categoría"),
    body("precio").isNumeric().withMessage("Selecciona un Precio"),
    body("habitaciones").isNumeric().withMessage("Selecciona el numero de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Selecciona el numero de plaza de estacionamiento"),
    body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardar)

router.get("/propiedades/agregar-imagen/:id",protegerRuta, agregarImagen )
router.post("/propiedades/agregar-imagen/:id",protegerRuta, 
    uploads.single("imagen"),
    almacenarImagen
 )


router.get("/propiedades/editar/:id",protegerRuta, editar)

router.post("/propiedades/editar/:id",protegerRuta, 
    body("titulo").notEmpty().withMessage("El titulo del Anuncio es Obligatorio"),
    body("descripcion")
        .notEmpty().withMessage("La Descripción no puede ir vacia")
        .isLength({max: 300}).withMessage("La Descripción no puede exceder los 300 caracteres"),
    body("categoria").isNumeric().withMessage("Selecciona una Categoría"),
    body("precio").isNumeric().withMessage("Selecciona un Precio"),
    body("habitaciones").isNumeric().withMessage("Selecciona el numero de Habitaciones"),
    body("estacionamiento").isNumeric().withMessage("Selecciona el numero de plaza de estacionamiento"),
    body("wc").isNumeric().withMessage("Selecciona la cantidad de baños"),
    body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
    guardarCambios)

router.post("/propiedades/eliminar/:id",protegerRuta, eliminar)
    

// AREA PUBLICA

router.get("/propiedad/:id",
    mostrarPropiedad
)
export default router