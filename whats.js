const fs = require('fs');
const mongoose = require('mongoose');
const { parse } = require('csv-parse');
require('dotenv').config(); // Carga el archivo .env

console.log('🚀 Iniciando importación desde CSV...');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });

// Definir el schema
const conversationSchema = new mongoose.Schema({
  contact_name: String,
  phone: String,
  contact_id: String,
  timestamp: Date,
  sender: String,
  channel: String,
  message: String,
  attachment_url: String,
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Ruta del CSV
const filePath = 'mensajes.csv';
const messages = [];

console.log(`📄 Leyendo archivo: ${filePath}...`);

fs.createReadStream(filePath)
  .pipe(parse({ columns: true, trim: true }))
  .on('data', (row) => {
    messages.push({
      contact_name: row.contact_name,
      phone: row.phone,
      contact_id: row.contact_id,
      timestamp: new Date(row.timestamp),
      sender: row.sender,
      channel: row.channel,
      message: row.message,
      attachment_url: row.attachment_url,
    });
  })
  .on('end', async () => {
    console.log(`📦 Total de mensajes leídos del CSV: ${messages.length}`);
    if (messages.length === 0) {
      console.warn('⚠️ No se encontraron mensajes para importar.');
      return mongoose.disconnect();
    }

    try {
      console.log('💾 Insertando en MongoDB...');
      const res = await Conversation.insertMany(messages);
      console.log(`✅ Importación completada. Total insertados: ${res.length}`);
    } catch (err) {
      console.error('❌ Error al insertar en MongoDB:', err.message);
    } finally {
      console.log('🔌 Cerrando conexión con MongoDB...');
      mongoose.disconnect();
    }
  })
  .on('error', (err) => {
    console.error('❌ Error al leer el archivo CSV:', err.message);
  });
