const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const axios = require('axios');
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

        // Webhook no bloqueante
        axios.post('https://gopitchering.app.n8n.cloud/webhook-test/882ebd94-8cb0-47b2-a5ae-05f7f8cc9ac5', {
          tipo: 'actualizacion',
          nombre,
          email,
          cursos: existingUser.cursos,
          fechaAsignacionMasterFade30: existingUser.fechaAsignacionMasterFade30
        }).catch(err => console.warn("⚠️ Error webhook:", err.message));

        return res.status(200).json({
          message: 'Curso agregado al usuario existente. Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
        });
      }

      return res.status(200).json({
        message: 'Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
      });
    }

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

    // Webhook no bloqueante
    axios.post('https://gopitchering.app.n8n.cloud/webhook-test/882ebd94-8cb0-47b2-a5ae-05f7f8cc9ac5', {
      tipo: 'nuevo',
      nombre,
      email,
      cursos: user.cursos,
      fechaAsignacionMasterFade30: user.fechaAsignacionMasterFade30
    }).catch(err => console.warn("⚠️ Error webhook:", err.message));

    // Enviar email de bienvenida
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
        subject: `¡Bienvenido a Erick Gomez Academy, ${nombre}! 🎉`,
        html: `
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/NF4pMWsn/cold-smooth-tasty-removebg-preview.png" style="max-width: 200px;" />
          </div>
          <h1>¡Hola ${nombre}! 👋</h1>
          <p>Bienvenido a <strong>Erick Gomez Academy</strong>.</p>
          <p>📘 Curso asignado: <strong>${cursoNuevo}</strong></p>
          <p>🔗 <a href="https://plataforma.erickgomezacademy.com/">Ir a la plataforma</a></p>
          <ul>
            <li>👤 Usuario: ${email}</li>
          </ul>
          <p>Guardá estos datos para acceder a tus clases.</p>
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
