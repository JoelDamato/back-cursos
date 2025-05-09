const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/Users');

const createUserAuto = async (req, res) => {
  try {
    const { nombre, email, password, cursos, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email no es válido' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const cursoNuevo = "Master Fade 3.0";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.cursos.includes(cursoNuevo)) {
        existingUser.cursos.push(cursoNuevo);

        if (!existingUser.fechaAsignacionMasterFade30) {
          existingUser.fechaAsignacionMasterFade30 = new Date();
          console.log("✅ Se asignó fechaAsignacionMasterFade30 a usuario existente.");
        }

        await existingUser.save();

        return res.status(200).json({
          message: 'Curso agregado al usuario existente. Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
        });
      }

      return res.status(200).json({
        message: 'Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
      });
    }

    // Crear usuario nuevo
    const hashedPassword = await bcrypt.hash(password, 10);
    const cursosFinal = cursos && cursos.length > 0 ? cursos : [cursoNuevo];
    const asignaMasterFade30 = cursosFinal.includes(cursoNuevo);

    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursosFinal,
      rol: rol || 'user',
      fechaAsignacionMasterFade30: asignaMasterFade30 ? new Date() : undefined,
    });

    try {
      await user.save();
      console.log("✅ Usuario nuevo creado con fecha de asignación:", user.fechaAsignacionMasterFade30);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'Ya existe una cuenta con este email.' });
      }
      throw err;
    }

    // Enviar email
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 587,
        secure: false,
        auth: {
          user: 'contacto@erickgomezacademy.com',
          pass: 'Gopitchering2024',
        },
      });

      const mailOptions = {
        from: '"Erick Gomez Academy" <contacto@erickgomezacademy.com>',
        to: email,
        subject: `👋 ¡Bienvenido ${nombre}! Accedé a tu curso Master Fade 3.0`,
        html: `
          <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
            <img src="https://www.erickgomezacademy.com/erickgomez.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;" />
            <h1 style="color: #000;">¡Bienvenido a la plataforma oficial de barberos!</h1>
            <p style="font-size: 16px; line-height: 1.5;">
              Te damos la bienvenida a <strong>Erick Gómez Academy</strong>, donde empieza tu transformación como barbero profesional.
              Ya tenés acceso al curso <strong>Master Fade 3.0</strong>.
            </p>
            <p style="font-size: 15px; margin-top: 20px;">
              Ingresá con los siguientes datos:
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px;">
              <li>👤 <strong>Usuario:</strong> ${email}</li>
              <li>🔑 <strong>Contraseña:</strong> ${password}</li>
            </ul>
            <a href="https://plataforma.erickgomezacademy.com/" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #00cc66; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Iniciar sesión en la plataforma
            </a>
            <p style="font-size: 13px; margin-top: 20px; color: #888;">
              Guardá esta información en un lugar seguro. Si tenés algún problema para acceder, escribinos al soporte.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.warn('⚠️ Error al enviar el correo (no crítico):', mailErr.message);
    }

    return res.status(201).json({ message: 'Usuario creado exitosamente.' });

  } catch (error) {
    console.error('❌ Error general al crear usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUserAuto;
