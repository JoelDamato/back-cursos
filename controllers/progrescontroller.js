const Progreso = require("../models/Progreso");
const User = require("../models/Users"); // asegurate de importar el modelo
const axios = require("axios");

const registrarProgreso = async (req, res) => {
  let { email, cursoId, capituloId, accion } = req.body;

  // 🔁 Normalizar cursoId para que coincida con el enum del schema
  const cursoIdNormalizado = {
    "growth-barber": "GROWTH BARBER",
    "master-fade": "Master Fade",
    "focus": "Focus",
    "cutting-mastery": "Cutting Mastery",
    "colorimetria": "Colorimetria",
    "master-fade-3-0": "Master Fade 3.0",
    "regalo-de-lanzamiento": "REGALO DE LANZAMIENTO"
  }[cursoId] || cursoId;
  
  cursoId = cursoIdNormalizado; // sobrescribimos cursoId con el nombre aceptado
  

  console.log("📩 Datos recibidos en el body:", { email, cursoId, capituloId, accion });

  if (!email || !cursoId || !capituloId || !accion) {
    console.warn("⚠️ Faltan datos obligatorios:", { email, cursoId, capituloId, accion });
    return res.status(400).json({
      error: "Faltan datos obligatorios",
      detalles: { email, cursoId, capituloId, accion }
    });
  }

  const webhookURL = "https://gopitchering.app.n8n.cloud/webhook-test/674ea47c-afe7-4483-ad0c-5df64f23c396";

  try {
    const ahora = new Date();
    const filtro = { email, cursoId, capituloId };
    const existente = await Progreso.findOne(filtro);

    console.log("🔍 Registro existente:", existente);

    if (
      existente &&
      (
        (existente.estado === "completado" && accion === "finalizado") ||
        (existente.estado === "en_progreso" && accion === "inicio")
      )
    ) {
      console.log("✅ Ya estaba registrado con el mismo estado, no se hace nada.");
      return res.status(200).json({ mensaje: "Progreso ya registrado previamente", estado: existente.estado });
    }

    let resultado;

    if (existente) {
      let update = {};

      if (accion === "inicio") {
        console.log("🛠 Actualizando a 'en_progreso'");
        update = {
          $set: {
            estado: "en_progreso",
            updatedAt: ahora
          }
        };
      } else if (accion === "finalizado") {
        console.log("🏁 Actualizando a 'completado'");
        update = {
          $set: {
            fechaFin: ahora,
            estado: "completado",
            updatedAt: ahora
          }
        };
      } else {
        console.warn("❌ Acción no válida:", accion);
        return res.status(400).json({ error: "Acción no válida", accion });
      }

      resultado = await Progreso.findOneAndUpdate(filtro, update, { new: true });
    } else {
      console.log("🆕 Creando nuevo registro de progreso");
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

    console.log("📤 Resultado final:", resultado);

// 🔄 Actualizar también en el modelo User

try {
  const user = await User.findOne({ email });

  if (user) {
    const curso = user.progresoCursos.find(c => c.curso === cursoId);

    if (!curso) {
      // Si el curso no existe aún, crearlo con el capítulo correspondiente
      user.progresoCursos.push({
        curso: cursoId,
        capitulos: [{
          capituloId,
          fechaInicio: accion === "inicio" ? ahora : undefined,
          fechaFin: accion === "finalizado" ? ahora : undefined,
          estado: accion === "finalizado" ? "completado" : "en_progreso"
        }]
      });
    } else {
      // Buscar si el capítulo ya existe
      const capitulo = curso.capitulos.find(c => c.capituloId === capituloId);

      if (!capitulo) {
        curso.capitulos.push({
          capituloId,
          fechaInicio: accion === "inicio" ? ahora : undefined,
          fechaFin: accion === "finalizado" ? ahora : undefined,
          estado: accion === "finalizado" ? "completado" : "en_progreso"
        });
      } else {
        if (accion === "inicio") {
          capitulo.fechaInicio = capitulo.fechaInicio || ahora
          capitulo.estado = "en_progreso";
        } else if (accion === "finalizado") {
          capitulo.fechaFin = ahora
          capitulo.estado = "completado";
        }
      }
    }

    await user.save();
    console.log("✅ Progreso actualizado también en el User");
  } else {
    console.warn("⚠️ Usuario no encontrado para actualizar progresoCursos");
  }
} catch (userUpdateError) {
  console.error("🚨 Error al actualizar progresoCursos en User:", userUpdateError.message);
}



    res.status(200).json(resultado);

    // Webhook no bloqueante
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
      console.error("🚨 Error al enviar al webhook:", webhookError.message);
    });

  } catch (error) {
    console.error("💥 Error en try/catch registrarProgreso:", error);

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
