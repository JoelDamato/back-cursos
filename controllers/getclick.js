const Click = require("../models/Clicks");

const obtenerTodosLosClicks = async (req, res) => {
  try {
    const clicks = await Click.find().sort({ fecha: -1 }); // ordena del más nuevo al más viejo
    res.status(200).json(clicks);
  } catch (error) {
    console.error("Error al obtener los clicks:", error);
    res.status(500).json({ error: "Error al obtener los clicks" });
  }
};

module.exports = obtenerTodosLosClicks;
