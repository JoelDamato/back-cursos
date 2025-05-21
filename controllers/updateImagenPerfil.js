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
      folder: 'perfiles-barberos',
    });

    // Borra el archivo local después de subirlo
    fs.unlinkSync(file.path);

    // Buscamos al usuario para modificarle imagen y ebook
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizamos imagenPerfil
    user.imagenPerfil = result.secure_url;

    // Si no tiene ebook, se lo asignamos
    if (!user.ebook) {
      user.ebook = true;
    }

    // Guardamos cambios
    await user.save();

    console.log('🔄 Usuario actualizado:', user);
    return res.status(200).json({ message: 'Imagen actualizada y ebook asignado correctamente.', user });
  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
module.exports = { updateImagenPerfil };