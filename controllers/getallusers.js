// controllers/getAllUsers.js
const User = require('../models/Users'); // Importar el modelo de usuario


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email nombre cursos rol createdAt').lean();
    const usersConCantidadCursos = users.map(user => ({
      ...user,
      cantidadCursos: user.cursos?.length || 0
    }));

    res.status(200).json(usersConCantidadCursos);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};

module.exports = getAllUsers;
