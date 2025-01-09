const Comment = require('../../models/Comments'); // Ajusta la ruta si es necesario

// Controlador para agregar un comentario
const addComment = async (req, res) => {
  const { courseId, moduleName, chapterId, userEmail, content } = req.body;

  try {
    const comment = new Comment({ courseId, moduleName, chapterId, userEmail, content });
    await comment.save();
    res.status(201).json({ message: 'Comentario agregado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar comentario', error });
  }
};

// Controlador para obtener comentarios por curso, módulo y capítulo
const getCommentsByCourseModuleAndChapter = async (req, res) => {
  const { courseId, moduleName, chapterId } = req.params;

  try {
    const comments = await Comment.find({ courseId, moduleName, chapterId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

module.exports = {
  addComment,
  getCommentsByCourseModuleAndChapter,
};
