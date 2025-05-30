const Conversation = require('../models/Conversation');

// GET /conversations/partial/:number
const getConversationsByPartialPhone = async (req, res) => {
  let { number } = req.params;

  if (!number) {
    return res.status(400).json({ message: 'Número inválido.' });
  }

  // 🔧 1. Limpiar: dejar solo números
  const cleanedNumber = number.replace(/\D/g, ''); // quita todo lo que no sea dígito

  if (cleanedNumber.length < 8) {
    return res.status(400).json({ message: 'El número es demasiado corto.' });
  }

  // 🔎 2. Tomar los últimos 8 dígitos
  const lastDigits = cleanedNumber.slice(-8);

  try {
    // 🧠 3. Buscar todos los teléfonos que TERMINAN con esos 8 dígitos, sin importar formato
    const regex = new RegExp(`[\\d\\s\\-\\+\\(\\)]*${lastDigits.split('').join('[\\D]*')}$`, 'i');

    const conversations = await Conversation.find({
      phone: { $regex: regex }
    }).sort({ timestamp: 1 });

    if (conversations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron conversaciones con ese número.' });
    }

    res.status(200).json(conversations);
  } catch (error) {
    console.error('❌ Error al buscar conversaciones:', error.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  getConversationsByPartialPhone,
};
