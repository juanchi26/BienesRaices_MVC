import express from 'express';
import csrf from "csurf"
import cookieParser from "cookie-parser"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import propiedadesRoutes from "./routes/propiedadesRoutes.js"
import appRoutes from "./routes/appRoutes.js"
import apiRoutes from "./routes/apiRoutes.js"
import db from "./config/db.js"


//Crear la App
const app = express();

//habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

//habilitar cookie parser
app.use(cookieParser())
app.use(csrf({cookie: true}))

//Conexión a la Base de Datos

try{
    await db.authenticate();
    db.sync();
    console.log("Conexión exitosa a la base de datos")
}catch(error){
    console.log(error)
}


//Habilitar pug
app.set("view engine", "pug")
app.set("views", "./views")

//Carpeta publica
app.use(express.static("public"))

app.use("/auth", usuarioRoutes)
app.use("/", propiedadesRoutes)
app.use("/", appRoutes)
app.use("/api", apiRoutes)

//Server y puerto
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})