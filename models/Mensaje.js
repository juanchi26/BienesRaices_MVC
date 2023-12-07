
import { DataTypes } from "sequelize"
import db from "../config/db.js"


const Mensaje = db.define('mensajes', {
        mensaje:{
            type: DataTypes.STRING(400),
            allowNull: false
        },
})

export default Mensaje