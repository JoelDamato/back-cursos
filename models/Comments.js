const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  courseId: {
    type: String, // Referencia al curso al que pertenece el comentario
    ref: 'Course',
    required: true,
  },
  chapterId: {
    type: Number, // ID del capítulo dentro del curso
    required: true,
  },
  userEmail: {
    type: String, // Identificación del usuario mediante correo electrónico
    required: true,
  },
  content: {
    type: String, // Contenido del comentario
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha y hora de creación del comentario
  },
});


module.exports = mongoose.model('Comment', commentSchema);
