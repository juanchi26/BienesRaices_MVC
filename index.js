import express from 'express';
import usuarioRoutes from "./routes/usuarioRoutes.js"

//Crear la App
const app = express();


//Habilitar pug
app.set("view engine", "pug")
app.set("views", "./views")

//Carpeta publica
app.use(express.static("public"))

app.use("/auth", usuarioRoutes)

//Server y puerto
const port = 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})