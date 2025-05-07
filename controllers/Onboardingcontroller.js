const Onboarding = require("../models/Onboarding");

// Crear nuevo formulario
const createOnboarding = async (req, res) => {
  const { email } = req.body;
  try {
    const exists = await Onboarding.findOne({ email });
    if (exists) return res.status(409).json({ message: "Ya existe" });

    const nuevo = new Onboarding(req.body);
    await nuevo.save();
    res.status(201).json({ message: "Formulario guardado correctamente" });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: "Error al verificar" });
  }
};

module.exports = { createOnboarding, checkIfCompleted };
