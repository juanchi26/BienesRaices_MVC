import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { generarJWT, generarId  } from '../helpers/tokens.js';
import Usuario from '../models/Usuario.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesión",
        csrfToken: req.csrfToken()
    });
}

const autenticar = async (req, res) => {

    const { email, password } = req.body

    await check("email").isEmail().withMessage('El email es obligatorio').run(req);
    await check("password").notEmpty().withMessage('La contraseña es obligatoria').run(req);

    let resultado = validationResult(req);



    //verifica que resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/login', {
            pagina: "Iniciar Sesión",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })
    
    if(!usuario){
        return res.render('auth/login', {
            pagina: "Iniciar Sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
        });
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: "Iniciar Sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        });
    }

    //revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: "Iniciar Sesión",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'La contraseña es incorrecta'}]
        });
    }

    //autenticar al usuario
    const token = generarJWT({id: usuario.id, nombre: usuario.nombre })
    console.log(token)
    //almacenar en una cookie

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true   con certificado ssl poner en true
        //sameSite: true  con certificado ssl poner en true
    }).redirect("/mis-propiedades")
}

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
    
}


const registroLogin = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear cuenta",
        csrfToken: req.csrfToken()
    });
}

const olvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: "Recupera tu acceso a Bienes Raices",
        csrfToken: req.csrfToken()
    });
}

const resetPassword = async (req, res) => {
    const { nombre, email, password } = req.body
    //validaciones 
    await check("email").isEmail().withMessage('El email es obligatorio').run(req);
  
    let resultado = validationResult(req);



    //verifica que resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        });
    }

    //Buscar el usuarior
    const usuario = await Usuario.findOne({ where: { email } })
    if(!usuario){
        return res.render('auth/olvide-password', {
            pagina: "Recupera tu acceso a Bienes Raices",
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no pertenece a ningun usuario'}]
        });
    }

    //generar un token y enviar email
    usuario.token = generarId();
    usuario.save()
    

    //enviar email
    emailOlvidePassword({
        email: usuario.email, nombre: usuario.nombre, token: usuario.token
    })

    //renderizar mensaje
    res.render('templates/mensaje', {
        pagina: "Reestablece tu contraseña ",
        mensaje: "Te enviamos un email para reestablecer tu contraseña"

    })
}

const comprobarToken = async (req, res) => {
    const {token} = req.params
    const usuario = await Usuario.findOne({where:{token}})
    
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: "Reestablece tu password",
            mensaje: "Hubo un error al validar tu información, intenta de nuevo",
            error: true
        })
    }

    //si es valido, mostrar formulario para reestablecer password
    res.render("auth/reset-password", {
        pagina: "Reestablece tu contraseña",
        csrfToken: req.csrfToken()

    })
}

const nuevoPassword = async (req, res) => {
    //validar el password
    await check("password").isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req)

    let resultado = validationResult(req);

    //verifica que resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/reset-password', {
            pagina: "Reestablece tu contraseña",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        });
    }

    const { token } = req.params 
    const { password } = req.body
    //identificar quien hace el cambio

    const usuario = await Usuario.findOne({where:{token}})



    //hashear el password

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash( password , salt);
    usuario.token = null;
    await usuario.save()

    res.render("auth/confirmar-cuenta",{
        pagina: "Contraseña  reestablecido",
        mensaje: "La contraseña se reestablecio correctamente"
    })

}

const registrar = async (req, res) => {
    const { nombre, email, password } = req.body
    //validaciones 
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check("email").isEmail().withMessage('El email es obligatorio').run(req);
    await check("password").isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres').run(req)
    await check("repetir_password").equals(password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req);



    //verifica que resultado este vacio
    if (!resultado.isEmpty()) {
        //ERRORES
        return res.render('auth/registro', {
            pagina: "Crear cuenta",
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre,
                email
            }
        });
    }

    //verficar que el usuario no este duplicado

    const existeUsuario = await Usuario.findOne({ where: { email } })

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: "Crear cuenta",
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya existe' }],
            usuario: {
                nombre,
                email
            }
        });

    }

    //Guardar el usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })


    //envia mail de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })


    //mostrar mensaje de confirmacion

    res.render('templates/mensaje', {
        pagina: "Cuenta Creada Correctamente",
        mensaje: "Te enviamos un email para confirmar tu cuenta, Haz Click en el enlace"

    })
}

//funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params
    //verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: "Error al confirmar tu cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save()
    return res.render('auth/confirmar-cuenta', {
        pagina: "Cuenta Confirmada",
        mensaje: "La cuenta se confirmo correctamente",
    })

}

export { formularioLogin, registroLogin, olvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevoPassword, autenticar, cerrarSesion }