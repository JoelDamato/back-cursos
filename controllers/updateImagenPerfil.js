// controllers/updateImagenPerfil.js
const Users = require('../models/Users');
const path = require('path');

const updateImagenPerfil = async (req, res) => {
  console.log('HOLAAAAAAAAAAAAAAAAAA');
  console.log('BODY:', req.body);
console.log('FILE:', req.file);
  const { email } = req.body;
  const file = req.file;

  if (!email || !file) {
    return res.status(400).json({ message: 'Faltan datos requeridos: email o archivo.' });
  }
console.log(email, file)
  try {
    // Construir la URL accesible de la imagen (ruta relativa o completa)
    const imagePath = `/uploads/${file.filename}`;
console.log(email, file)

    const user = await Users.findOneAndUpdate(
      { email },
      { imagenPerfil: imagePath },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
console.log('🔄 Usuario actualizado:', user);
    return res.status(200).json({ message: 'Imagen actualizada correctamente.', user });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
module.exports = { updateImagenPerfil };
