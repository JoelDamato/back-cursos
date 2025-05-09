const bcrypt = require('bcryptjs');
const User = require('../models/Users');

const editUser = async (req, res) => {
  try {
    console.log('📥 Cuerpo de la solicitud recibido para edición:', req.body);
    const { email } = req.params;
    const { nombre, password, cursos, rol } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email del usuario es requerido' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (nombre) user.nombre = nombre;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (cursos) {
      console.log("🧠 Cursos anteriores del usuario:", user.cursos);
      console.log("🆕 Cursos que se van a guardar:", cursos);

      if (
        !user.cursos.includes("Master Fade 3.0") &&
        cursos.includes("Master Fade 3.0")
      ) {
        user.fechaAsignacionMasterFade30 = new Date();
        console.log("✅ Se asignó fechaAsignacionMasterFade30:", user.fechaAsignacionMasterFade30);
      } else {
        console.log("ℹ️ No se actualizó fechaAsignacionMasterFade30 (ya lo tenía o no se agregó)");
      }

      user.cursos = cursos;
    }

    if (rol) user.rol = rol;

    await user.save();
    console.log("✅ Usuario actualizado y guardado:", user.email);
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });

  } catch (error) {
    console.error('❌ Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = editUser;
