import bcrypt from "bcrypt";

const usuarios = [{
    nombre: "Juan",
    email: "juanchi.diaz@hotmail.com",
    confirmado: 1,
    password: bcrypt.hashSync("1234567", 10)
}]


export default usuarios