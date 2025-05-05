// controllers/updateImagenPerfil.js
const Users = require('../models/Users'); // Ajustá la ruta si tu modelo está en otro lugar

exports.updateImagenPerfil = async (req, res) => {
  const { email, imagenPerfil } = req.body;

  if (!email || !imagenPerfil) {
    return res.status(400).json({ message: 'Email e imagenPerfil son requeridos.' });
  }

  try {
    const user = await Users.findOneAndUpdate(
      { email },
      { imagenPerfil },
      { new: true } // Devuelve el documento actualizado
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.status(200).json({ message: 'Imagen actualizada correctamente.', user });
  } catch (error) {
    console.error('Error actualizando imagen de perfil:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
