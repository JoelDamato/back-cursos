const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/Users'); // Importar el modelo de usuario

const createUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido:', req.body);

    const { nombre, email, password, cursos, rol } = req.body;

    // Validaciones de campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Validar el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email no es válido' });
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursos || [],
      rol: rol || 'user',
    });

    await user.save();

    // Configurar el transporte de Nodemailer con SMTP GoDaddy
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net', // Servidor SMTP de GoDaddy
      port: 587, // Puerto STARTTLS (usar 465 si es SSL)
      secure: false, // false para STARTTLS, true para SSL
      auth: {
        user: 'contacto@erickgomezacademy.com', // Tu correo
        pass: 'Gopitchering2024', // Tu contraseña
      },
      debug: true, // Mostrar logs de depuración
      logger: true, // Habilitar logs detallados
    });

    // Configurar las opciones del correo
    const mailOptions = {
      from: '"Erick Gomez Academy" <contacto@erickgomezacademy.com>',
      to: email, // Correo del usuario registrado
      subject: `¡Bienvenido a Erick Gomez Academy, ${nombre}! 🎉`,
      html: `
      <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.postimg.cc/NF4pMWsn/cold-smooth-tasty-removebg-preview.png" alt="Erick Gomez Academy Logo" style="max-width: 200px; height: auto;" />
    </div>
        <h1>¡Hola ${nombre}! 👋</h1>
        <p>Primero que todo, quiero darte una gran bienvenida a <strong>Erick Gomez Academy</strong>. 👏🏽 Felicidades por dar este importante paso para aumentar tu nivel como barbero. Has tomado la decisión de invertir en vos mismo y en tu futuro, y eso ya te pone un paso adelante de muchos.</p>
        <p>Este curso no solo es una oportunidad de aprendizaje, es el comienzo de una nueva etapa donde tu talento se transforma en excelencia. Estamos seguros de que aquí vas a encontrar las herramientas, técnicas y conocimientos necesarios para convertirte en el barbero que otros quieren ser.</p>
        <p>A continuación, te dejamos los datos de acceso para que puedas ingresar a nuestra plataforma y comenzar esta increíble experiencia:</p>
        <ul>
          <li>🔗 <strong>Acceso a la plataforma:</strong> <a href="https://plataforma.erickgomezacademy.com/">Plataforma Erick Gomez</a></li>
          <li>👤 <strong>Usuario:</strong> ${email}</li>
          <li>🔒 <strong>Contraseña:</strong> ${password}</li>
        </ul>
        <p>👉🏽 <strong>IMPORTANTE:</strong> Guardá esta información para acceder a tus clases y recursos siempre que lo necesites.</p>
        <p>¿Dudas? No estás solo. Tenés a todo nuestro equipo disponible para ayudarte en lo que necesites.</p>
        <p>¡Ahora es tu turno de brillar y marcar la diferencia! 💪🏽 Estoy emocionado de acompañarte en este camino de crecimiento y éxito.</p>
        <p>¡Nos vemos dentro!</p>
        <p>Un gran saludo,<br />
        Erick Gomez y el equipo de Erick Gomez Academy 🚀</p>
      `,
    };

    // Enviar el correo de bienvenida
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error al enviar el correo:', err);
        return res
          .status(500)
          .json({ message: 'Usuario creado, pero hubo un error al enviar el correo.' });
      }
      console.log('Correo enviado con éxito:', info.messageId);
      return res
        .status(201)
        .json({ message: 'Usuario creado exitosamente. Se envió un correo de bienvenida.' });
    });
  } catch (error) {
    console.error('Error al crear el usuario o enviar el correo:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUser;
