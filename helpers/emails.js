import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const { email, nombre, token } = datos;
      //Enviar el email
      await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Confirma tu cuenta en BienesRaices",
        text: "Confirma tu cuenta en BienesRaices",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en BienesRaices</p>
              <p>Tu cuenta ya esta lista!, solo debes confirmarla en el siguiente enlace: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>
              <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `

      }) 
}

const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const { email, nombre, token } = datos;
    //Enviar el email
    await transport.sendMail({
      from: "BienesRaices.com",
      to: email,
      subject: "Restablece tu contraseña en Bienes raices",
      text: "Confirma tu cuenta en BienesRaices",
      html: `<p>Hola: ${nombre}, has solicitado reestablecer tu contraseña en Bienes Raices</p>
            <p>Haz click en el siguiente enlace para generar una nueva contraseña: <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer password</a> </p>
            <p>Si tu no solicitaste el cambio de contraseña, puedes ignorar este mensaje</p>
      `

    }) 
}





export {
  emailRegistro,
  emailOlvidePassword
};