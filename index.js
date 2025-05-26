require('dotenv').config(); // Siempre primero

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const bancoRoutes = require('./routes/bancorout');
const loginRoutes = require('./routes/loginrout');
const createRoutes = require('./routes/createusers');
const searchRoutes = require('./routes/searchrout');
const updateRoutes = require('./routes/updaterout');
const commentsRoutes = require('./routes/commentsrout');
const coursesRoutes = require('./routes/coursesrout');
const ipRoutes = require('./routes/iprout');
const clickRoutes = require('./routes/clickrout');
const webhookRoutes = require('./routes/webhookrout.js');

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Debug temporal
console.log("URI:", process.env.MONGODB_URI);

// Conexión a MongoDB (sin opciones obsoletas)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conexión exitosa con MongoDB'))
  .catch((error) => console.error('❌ Error al conectar con MongoDB:', error));

// Rutas
app.use('/api/bancos', bancoRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/create', createRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/ip', ipRoutes);
app.use('/api', clickRoutes);
app.use('/webhook', webhookRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
