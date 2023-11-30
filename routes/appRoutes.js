import express from 'express';
import { inicio, categoria, buscador, noEncontrado } from "../controllers/appController.js"
const router = express.Router()

//pagina de inicio
router.get('/', inicio)

//categorias
router.get('/categorias/:id', categoria)
//buscador
router.post('/buscador', buscador)

//404
router.get('/404', noEncontrado)
export default router