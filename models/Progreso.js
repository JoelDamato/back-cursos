const mongoose = require("mongoose");

const progresoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  cursoId: {
    type: String,
    required: true
  },
  capituloId: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ["pendiente", "en_progreso", "completado"],
    default: "pendiente"
  },
  fechaInicio: {
    type: Date,
    default: null
  },
  fechaFin: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Previene duplicados por usuario + capítulo
progresoSchema.index({ email: 1, cursoId: 1, capituloId: 1 }, { unique: true });

module.exports = mongoose.model("Progreso", progresoSchema);
