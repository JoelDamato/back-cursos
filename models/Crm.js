const mongoose = require('mongoose');

const crmSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  creadoEn: { type: Date, default: Date.now },
  properties: { type: Object }, // Guarda todas las propiedades Notion en bruto
});

module.exports = mongoose.model('Crm', crmSchema);
