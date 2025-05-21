// controllers/updateImagenPerfil.js
const Users = require('../models/Users');
const cloudinary = require('../middleware/cloudinary');
const fs = require('fs');
const path = require('path');

const updateImagenPerfil = async (req, res) => {

  const { email } = req.body;
  const file = req.file;

  if (!email || !file) {
    return res.status(400).json({ message: 'Faltan datos requeridos: email o archivo.' });
  }

  try {
    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'perfiles-barberos', // Opcional: carpeta en Cloudinary
    });

    // Borra el archivo local después de subirlo
    fs.unlinkSync(file.path);

    const user = await Users.findOneAndUpdate(
      { email },
      { imagenPerfil: result.secure_url },
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
