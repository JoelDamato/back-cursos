const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const MONGODB_URI = "mongodb://damatojoel25:jWOsVKueUGU1MwlM@cluster0-shard-00-00.mkhzd.mongodb.net:27017,cluster0-shard-00-01.mkhzd.mongodb.net:27017,cluster0-shard-00-02.mkhzd.mongodb.net:27017/test?ssl=true&replicaSet=atlas-13201f-shard-0&authSource=admin&retryWrites=true&w=majority";

const User = require('./models/Users'); // Asegurate de que la ruta sea correcta

const emails = [];
const eliminados = [];
const errores = [];

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('🟢 Conectado a MongoDB');
  iniciarEliminacion();
})
.catch((err) => {
  console.error('❌ Error al conectar con MongoDB:', err);
});

function iniciarEliminacion() {
  fs.createReadStream('emails.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (row.email) {
        emails.push(row.email.trim());
      }
    })
    .on('end', async () => {
      console.log(`📄 Se leyeron ${emails.length} emails desde el CSV`);

      for (const email of emails) {
        try {
const deleted = await User.findOneAndDelete({ email: new RegExp(`^${email}$`, 'i') });
          if (deleted) {
            console.log(`✅ Usuario eliminado: ${email}`);
            eliminados.push(email);
          } else {
            console.warn(`⚠️ No se encontró usuario: ${email}`);
            errores.push(email);
          }
        } catch (err) {
          console.error(`❌ Error eliminando ${email}: ${err.message}`);
          errores.push(email);
        }
      }

      // Escribir CSV de eliminados
      const eliminadosCSV = eliminados.map(email => `${email}\n`).join('');
      fs.writeFileSync('eliminados.csv', `email\n${eliminadosCSV}`);

      // Escribir CSV de errores/no encontrados
      const erroresCSV = errores.map(email => `${email}\n`).join('');
      fs.writeFileSync('no_encontrados.csv', `email\n${erroresCSV}`);

      console.log(`\n✅ Finalizado. Eliminados: ${eliminados.length}, No encontrados: ${errores.length}`);
      console.log('📁 Archivos generados: eliminados.csv y no_encontrados.csv');

      mongoose.connection.close();
    });
}
