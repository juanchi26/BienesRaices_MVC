import express from "express";
import { formularioLogin, registroLogin, olvidePassword } from "../controllers/usuarioController.js";	
const router = express.Router();


router.get('/login',formularioLogin)
router.get('/registro', registroLogin)
router.get('/olvide-password', olvidePassword)

router.get('/nosotros', (req, res) => {
    res.send('Info de Nosotros');
})


export default router