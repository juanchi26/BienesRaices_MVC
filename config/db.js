import sequelize from "sequelize";
import dotenv from "dotenv";


dotenv.config({path:".env"});

const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {      //nombre, usuario, pass
    host: process.env.DB_HOST,         // ip de la conexion (este caso, conexion local)
    port:3306,                 // puerto de conexion
    dialect: "mysql",   //base de datos a utilizar
    define:{
        timestamps: true  //cuando un usuario se registra agrega 2 columnas , una cuando fue creado y cuando fue actualizado
    },
    pool: {        //reutiliza conexiones "vivas"
        max:5,          //maximo de conexiones
        min:0,
        acquire: 30000,       // 30 segundos antes de un error
        idle: 10000             //10 segundos antes de que se cierre una conexion
    },
    operatorAliases: false  //asegurar que no se produzcan errores de sintaxis
})


export default db;