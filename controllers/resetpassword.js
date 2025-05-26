const nodemailer = require('nodemailer');

const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Falta el email' });

  const FRONT_URL = 'https://erickgomezacademy.com/editar-password?email=' + encodeURIComponent(email);

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: 'contacto@erickgomezacademy.com',
        pass: 'Gopitchering2024',
      },
      debug: true,
      logger: true,
    });

    const mailOptions = {
      from: '"Erick Gomez Academy" <contacto@erickgomezacademy.com>',
      to: email,
      subject: '🔒 Restablecé tu contraseña - Erick Gomez Academy',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 30px; font-family: sans-serif; background: #f9f9f9; border-radius: 8px; text-align: center;">
          <img src="https://www.erickgomezacademy.com/erickgomez.png" alt="Erick Gomez Academy Logo" style="width: 180px; margin-bottom: 20px;" />

          
          <p style="font-size: 16px; color: #333;">
            Recibimos tu solicitud para cambiar la contraseña.<br />
            Hacé clic en el botón a continuación para restablecerla:
          </p>

          <div style="margin: 30px 0;">
            <a href="${FRONT_URL}" style="
              background-color: #0054ff;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            ">
              Cambiar Contraseña
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            Si no solicitaste esto, podés ignorar este mensaje.<br /><br />
            Un saludo,<br />
            <strong>Erick Gomez Academy</strong>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '📩 Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar link de recuperación:', error);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
};

module.exports = sendResetPasswordLink;
