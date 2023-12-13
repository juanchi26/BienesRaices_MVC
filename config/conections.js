import db from "./db.js"

async function obtenerConexionesActivas() {
    try {
        const conexionesActivas = await db.connectionManager.getConnections();
        console.log('Número de conexiones activas:', conexionesActivas);
    } catch (error) {
        console.error('Error al obtener conexiones activas:', error);
    } finally {
        // Cierra la conexión a la base de datos después de obtener la información
        await db.close();
    }
}

export default obtenerConexionesActivas