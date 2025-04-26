// Importar los módulos necesarios
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Importar dotenv para manejar variables de entorno

const bancoRoutes = require('./routes/bancorout');
const loginRoutes = require('./routes/loginrout');
const createRoutes = require('./routes/createusers');
const searchRoutes = require('./routes/searchrout');
const updateRoutes = require('./routes/updaterout');
const commentsRoutes =require('./routes/commentsrout');
const coursesRoutes =require('./routes/coursesrout');
const ipRoutes =require('./routes/iprout');
const clickRoutes = require("./routes/clickrout");
const webhookRoutes = require('./routes/webhookrout.js'); // 

// Configuración de la app
const app = express();
app.use(cors()); // Permitir acceso desde cualquier origen (CORS liberado)
app.use(express.json());

// Conectar con MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500, // Configurar el tamaño máximo del pool de conexiones
})
  .then(() => console.log('Conexión exitosa con MongoDB'))
  .catch((error) => console.error('Error al conectar con MongoDB:', error));


// Usar las rutas
app.use('/api/bancos', bancoRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/create', createRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/update', updateRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/ip', ipRoutes);
app.use("/api", clickRoutes);
/*-----------*/
app.use('/webhook', webhookRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Exportar la aplicación como módulo
module.exports = app;
