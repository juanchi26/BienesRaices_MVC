const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesión"
    });
}

const registroLogin = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear cuenta"
    });
}

const olvidePassword  = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu acceso a Bienes Raices"
    });
} 


export {formularioLogin, registroLogin, olvidePassword}