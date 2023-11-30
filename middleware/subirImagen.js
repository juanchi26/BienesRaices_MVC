import multer from "multer";
import path from "path";
import { generarId } from "../helpers/tokens.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, generarId() + path.extname(file.originalname) ) //generarId() + path.extname(file.originalname) --> para que no se repitan los nombres de archivos
    }
})


const uploads = multer({ storage }) 


export default uploads