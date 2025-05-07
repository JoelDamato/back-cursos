const mongoose = require("mongoose");

const OnboardingSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  pais: String,
  whatsapp: String,
  instagram: String,
  trabajaComoBarbero: String,
  tipoTrabajo: String,
  tiempoCorte: String,
  precioPromedio: String,
  desafio: [String],
  herramientas: [String],
  motivacion: String,
  objetivo3Meses: String,
  aprenderClientes: String,
  abrirBarberia: String,
  serEducador: String,
  esfuerzoExtra: String,
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Onboarding", OnboardingSchema);
