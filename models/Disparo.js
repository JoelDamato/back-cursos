const mongoose = require('mongoose');

const disparoSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  etapa: { type: String, required: true }, // ej: 'form', 'bienvenida', etc.
  disparo2h: { type: Boolean, default: false },
  disparo12h: { type: Boolean, default: false },
  disparo24h: { type: Boolean, default: false },
  disparo1semana: { type: Boolean, default: false },
}, { timestamps: true });

disparoSchema.index({ userEmail: 1, etapa: 1 }, { unique: true });

module.exports = mongoose.model('Disparo', disparoSchema);
