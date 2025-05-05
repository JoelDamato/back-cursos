const Progreso = require("../models/Progreso");

const registrarProgreso = async (req, res) => {
  const { email, cursoId, capituloId, accion } = req.body;

  if (!email || !cursoId || !capituloId || !accion) {
    return res.status(400).json({
      error: "Faltan datos obligatorios",
      detalles: { email, cursoId, capituloId, accion }
    });
  }

  try {
    const filtro = { email, cursoId, capituloId };
    const existente = await Progreso.findOne(filtro);

    if (existente) {
      let update = {};

      if (accion === "inicio") {
        update = {
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
        return res.status(400).json({ error: "Acción no válida", accion });
      }

      const actualizado = await Progreso.findOneAndUpdate(filtro, update, { new: true });
      return res.status(200).json(actualizado);
    } else {
      const nuevo = new Progreso({
        email,
        cursoId,
        capituloId,
        fechaInicio: accion === "inicio" ? new Date() : undefined,
        fechaFin: accion === "finalizado" ? new Date() : undefined,
        estado: accion === "finalizado" ? "completado" : "en_progreso"
      });

      await nuevo.save();
      return res.status(200).json(nuevo);
    }
  } catch (error) {
    console.error("Error al registrar progreso:", error);

    if (error.name === "ValidationError") {
      return res.status(422).json({
        error: "Error de validación",
        detalles: error.errors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Registro duplicado",
        detalles: error.keyValue
      });
    }

    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined
    });
  }
};

module.exports = registrarProgreso;
