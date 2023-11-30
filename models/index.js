import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";


Propiedad.belongsTo(Precio, { foreignKey: "precioId", as: "precio"} );     //relaciones 1:1 cada propiedad tiene un precio categoria y usuario
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId", as: "categoria"}, );
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId"} );

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario   
}