const mongoose = require('mongoose');

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
      "Master Fade 3.0", 
    ] 
  },
  rol: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  nivel: {
    type: String,
    default: "Principiante" // o podés dejar sin default si querés
  },
  imagenPerfil: {
    type: String, // Espera una URL
    default: "https://i0.wp.com/mybarbero.com/wp-content/uploads/2024/09/Barberos-a-domicilio-mybarbero.com_.jpg"   // o una URL por defecto si querés mostrar avatar genérico
  }
}, { timestamps: true });

module.exports = mongoose.model('Users', UserSchema);
