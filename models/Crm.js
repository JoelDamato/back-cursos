const mongoose = require('mongoose');

const CrmSchema = new mongoose.Schema({
  id: { type: String, required: false, unique: true }, // El id si viene, si no, null
  dataCompleta: { type: Object, required: true }, // Guarda todo el payload
  creadoEn: { type: Date, default: Date.now } // Para trackear cuándo se guardó
});

module.exports = mongoose.model('Crm', CrmSchema);
