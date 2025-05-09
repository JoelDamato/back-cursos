const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String }, // ✅ Nuevo campo para teléfono

  cursos: { 
    type: [String], 
    enum: [
      "Focus", 
      "Master Fade", 
      "Cutting Mastery", 
      "Colorimetria", 
      "GROWTH BARBER",
      "Master Fade 3.0",
      "REGALO DE LANZAMIENTO",
      "Cupon",
    ] 
  },
  rol: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  progresoCursos: [
    {
      curso: {
        type: String,
        enum: [
          "Focus", 
          "Master Fade", 
          "Cutting Mastery", 
          "Colorimetria", 
          "GROWTH BARBER",
          "Master Fade 3.0",
          "REGALO DE LANZAMIENTO",
        ],
      },
      capitulos: [
        {
          capituloId: { type: String }, // Ej: "Modulo1-1"
          fechaInicio: { type: Date },
          fechaFin: { type: Date },
          estado: {
            type: String,
            enum: ["en_progreso", "completado"],
            default: "en_progreso"
          }
        }
      ]
    }
  ],
  
  nivel: {
    type: String,
    default: "Principiante"
  },
  imagenPerfil: {
    type: String,
    default: "https://i0.wp.com/mybarbero.com/wp-content/uploads/2024/09/Barberos-a-domicilio-mybarbero.com_.jpg"
  },
  fechaAsignacionMasterFade30: { type: Date },

  // ✅ Nuevos campos para formulario
  completoForm: {
    type: Boolean,
    default: false,
  },
  fechaFormCompletado: {
    type: Date,
  },

  // ✅ Nuevo campo automático
  Csm: {
    type: String,
    default: "texto"
  }

}, { timestamps: true });

module.exports = mongoose.model('Users', UserSchema);
