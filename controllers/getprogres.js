const Progreso = require("../models/Progreso");

const obtenerTodosLosProgresos = async (req, res) => {
  try {
    const progreso = await Progreso.find({});
    res.status(200).json(progreso);
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error al obtener todos los progresos" });
  }
};

module.exports = obtenerTodosLosProgresos;
