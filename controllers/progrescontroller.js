const Progreso = require("../models/Progreso");
const axios = require("axios");

const registrarProgreso = async (req, res) => {
  const { email, cursoId, capituloId, accion } = req.body;

  if (!email || !cursoId || !capituloId || !accion) {
    return res.status(400).json({
      error: "Faltan datos obligatorios",
      detalles: { email, cursoId, capituloId, accion }
    });
  }

  const webhookURL = "https://gopitchering.app.n8n.cloud/webhook-test/674ea47c-afe7-4483-ad0c-5df64f23c396";

  try {
    const filtro = { email, cursoId, capituloId };
    const existente = await Progreso.findOne(filtro);

    let resultado;

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

      resultado = await Progreso.findOneAndUpdate(filtro, update, { new: true });
    } else {
      resultado = new Progreso({
        email,
        cursoId,
        capituloId,
        fechaInicio: accion === "inicio" ? new Date() : undefined,
        fechaFin: accion === "finalizado" ? new Date() : undefined,
        estado: accion === "finalizado" ? "completado" : "en_progreso"
      });

      await resultado.save();
    }

    // Primero responder al cliente
    res.status(200).json(resultado);

    // Luego enviar al webhook sin afectar al flujo
    axios.post(webhookURL, {
      email,
      cursoId,
      capituloId,
      accion,
      estado: resultado.estado,
      fechaInicio: resultado.fechaInicio,
      fechaFin: resultado.fechaFin,
      updatedAt: resultado.updatedAt
    }).catch((webhookError) => {
      console.error("Error al enviar al webhook (no afecta al flujo):", webhookError.message);
    });

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
