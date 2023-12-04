import express from "express";
import { formularioLogin, registroLogin, olvidePassword,registrar, confirmar, resetPassword, comprobarToken , nuevoPassword, autenticar, cerrarSesion } from "../controllers/usuarioController.js";	
const router = express.Router();


router.get('/login',formularioLogin)
router.post('/login',autenticar)
//Cerrar sesion
router.post('/cerrar-sesion', cerrarSesion)

router.get('/registro', registroLogin)
router.post('/registro', registrar)
router.get('/olvide-password', olvidePassword)
router.post('/olvide-password', resetPassword)
router.get('/confirmar/:token', confirmar)


//Almacena el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)



export default router