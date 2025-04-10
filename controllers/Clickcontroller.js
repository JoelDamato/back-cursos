const Click = require("../models/Clicks");

const registrarClick = async (req, res) => {
  try {
    const { proyecto, curso, fecha } = req.body;
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "desconocida";

    const nuevoClick = new Click({ proyecto, curso, fecha, ip });
    await nuevoClick.save();

    res.status(200).json({ mensaje: "Click registrado correctamente" });
  } catch (err) {
    console.error("Error al guardar el click:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = registrarClick;
