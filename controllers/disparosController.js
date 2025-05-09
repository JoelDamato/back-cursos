const Disparo = require('../models/Disparo');

// Crear o actualizar disparo por usuario y etapa
const guardarDisparo = async (req, res) => {
  const { userEmail, etapa, key, value } = req.body;

  if (!userEmail || !etapa || !key) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const update = { [key]: value };
    const disparo = await Disparo.findOneAndUpdate(
      { userEmail, etapa },
      { $set: update },
      { upsert: true, new: true }
    );

    res.status(200).json(disparo);
  } catch (err) {
    console.error('Error guardando disparo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los disparos (opcional)
const obtenerDisparos = async (req, res) => {
  try {
    const datos = await Disparo.find();
    res.status(200).json(datos);
  } catch (err) {
    console.error('Error al traer disparos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { guardarDisparo, obtenerDisparos };
