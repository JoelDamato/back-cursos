const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  proyecto: { type: String, required: true },
  curso: { type: String, required: true },
  fecha: { type: Date, required: true },
  ip: { type: String },
});

module.exports = mongoose.model("Click", ClickSchema);
