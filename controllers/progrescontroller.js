const Progreso = require("../models/Progreso");

const registrarProgreso = async (req, res) => {
  const { email, cursoId, capituloId, accion } = req.body;

  if (!email || !cursoId || !capituloId || !accion) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    let update = {};

    if (accion === "inicio") {
      update = {
        $setOnInsert: { fechaInicio: new Date() },
        $set: {
          estado: "en_progreso",
          updatedAt: new Date()
        }
      };
    } else if (accion === "finalizado") {
      update = {
        $set: {
          fechaFin: new Date(),
          estado: "completado",
          updatedAt: new Date()
        }
      };
    } else {
      return res.status(400).json({ error: "Acción no válida" });
    }

    const progreso = await Progreso.findOneAndUpdate(
      { email, cursoId, capituloId },
      update,
      { upsert: true, new: true }
    );

    res.status(200).json(progreso);
  } catch (error) {
    console.error("Error al registrar progreso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports =  registrarProgreso

