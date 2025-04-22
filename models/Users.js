// Importar mongoose
const mongoose = require('mongoose');

// Definir el esquema para el usuario
const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cursos: { 
    type: [String], 
    enum: [
      "Focus", 
      "Master Fade", 
      "Cutting Mastery", 
      "Colorimetria", 
      "GROWTH BARBER", 
      "REGALO DE LANZAMIENTO", 
      "Cupon"
    ] 
  },
  rol: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
}, { timestamps: true }); // Esto agrega createdAt y updatedAt

// Exportar el modelo de usuario
module.exports = mongoose.model('Users', UserSchema);
