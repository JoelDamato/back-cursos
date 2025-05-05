const Progreso = require("../models/Progreso");

const obtenerProgresoPorUsuario = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Falta el parámetro 'email'" });
  }

  try {
    const progreso = await Progreso.find({ email }) || [];
    if (!Array.isArray(progreso)) {
      return res.status(500).json({ error: "El progreso no es un array válido" });
    }

    res.status(200).json(progreso);
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error al obtener los progresos del usuario" });
  }
};

module.exports = obtenerProgresoPorUsuario;
