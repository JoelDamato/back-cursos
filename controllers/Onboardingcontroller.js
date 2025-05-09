const Onboarding = require("../models/Onboarding");
const User = require("../models/Users"); // ✅ Importar el modelo de usuario

// Crear nuevo formulario
const createOnboarding = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si ya existe un onboarding con ese email
    const exists = await Onboarding.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Ya existe" });
    }

    // Guardar el nuevo formulario
    const nuevo = new Onboarding(req.body);
    await nuevo.save();

    // ✅ Actualizar el usuario si existe
    const user = await User.findOne({ email });
    if (user) {
      user.completoForm = true;
      user.fechaFormCompletado = new Date();
      user.telefono = req.body.whatsapp; 
      await user.save();
      console.log(`✅ Usuario ${email} actualizado con completoForm = true`);
    } else {
      console.warn(`⚠️ No se encontró usuario con email ${email} para actualizar`);
    }

    res.status(201).json({ message: "Formulario guardado correctamente" });
  } catch (error) {
    console.error("❌ Error al guardar formulario:", error);
    res.status(500).json({ message: "Error al guardar formulario" });
  }
};

// Verificar si ya completó
const checkIfCompleted = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await Onboarding.findOne({ email });
    res.json({ completed: !!user });
  } catch (error) {
    console.error("❌ Error al verificar onboarding:", error);
    res.status(500).json({ message: "Error al verificar" });
  }
};

module.exports = {
  createOnboarding,
  checkIfCompleted,
};
