// controllers/getUserDataByEmail.js
const User = require('../models/Users');

const getUserDataByEmail = async (req, res) => {
  console.log('Solicitud recibida en el endpoint /api/search/users');
  console.log('Cuerpo de la solicitud:', req.body);

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).lean(); // .lean() para performance

    console.log('Resultado de la búsqueda del usuario:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: user._id,
      nombre: user.nombre,
      email: user.email,
      cursos: user.cursos,
      rol: user.rol,
      imagenPerfil: user.imagenPerfil || '',
      nivel: user.nivel || 'Principiante',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getUserDataByEmail;
