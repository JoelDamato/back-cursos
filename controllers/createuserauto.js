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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const cursoNuevo = "Master Fade 3.0";
      if (!existingUser.cursos.includes(cursoNuevo)) {
        existingUser.cursos.push(cursoNuevo);
        await existingUser.save();
        return res.status(200).json({
          message: 'Curso agregado al usuario existente. Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
        });
      } else {
        return res.status(200).json({
          message: 'Ya tenés una cuenta activa. Iniciá sesión con tu contraseña habitual o solicitá un restablecimiento si no la recordás.'
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursos || ["Master Fade 3.0"],
      rol: rol || 'user',
    });

    await user.save();

    // Enviar email (no usamos return si falla)
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
          <p>📘 Curso asignado: <strong>Master Fade 3.0</strong></p>
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
      // No hacemos return para no cortar la respuesta principal
    }

    // SIEMPRE respondemos éxito al frontend si el usuario se creó bien
    return res.status(201).json({ message: 'Usuario creado exitosamente.' });

  } catch (error) {
    console.error('❌ Error general al crear usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUserAuto;
