const mongoose = require('mongoose');
const fetch = require('node-fetch');
const MessageByPhone = require('./models/MessageByPhone');

const API_BASE_URL = 'https://api.callbell.eu/v1';
const API_KEY = 'zgrKCNQV9FF4MGQP2j6MUFMdpwu15qbV.d3c77927d30a5dfded57631d741757868065812a7dec2be9436aaf8f71985fa6';
const MONGODB_URI = 'mongodb://damatojoel25:jWOsVKueUGU1MwlM@cluster0-shard-00-00.mkhzd.mongodb.net:27017,cluster0-shard-00-01.mkhzd.mongodb.net:27017,cluster0-shard-00-02.mkhzd.mongodb.net:27017/test?ssl=true&replicaSet=atlas-13201f-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    importarMensajesDesdeCallbell();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });

function obtenerSender(msg) {
  if (msg.status === 'sent') return 'Nosotros';
  if (msg.status === 'received') return 'Cliente';
  if (msg.status === 'note') return 'Sistema';
  return 'Desconocido';
}

async function importarMensajesDesdeCallbell() {
  let page = 351; // <--- ¡CAMBIÁ ESTE VALOR para retomar!
  let totalInsertados = 0;
  let totalOmitidos = 0;

  while (true) {
    console.log(`\n🔍 Página de contactos ${page}...`);

    const res = await fetch(`${API_BASE_URL}/contacts?page=${page}&limit=100`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error(`❌ Error parseando JSON en página ${page}`);
      break;
    }

    if (!data.contacts || data.contacts.length === 0) {
      console.log('✅ Fin de contactos. No hay más páginas.');
      break;
    }

    for (const contacto of data.contacts) {
      console.log(`👤 Procesando contacto: ${contacto.name || 'Sin nombre'} (${contacto.uuid})`);

      let mensajes = [];
      try {
        mensajes = await fetchMessagesByContact(contacto.uuid);
        console.log(`📨 Se recuperaron ${mensajes.length} mensajes para ${contacto.name || contacto.uuid}`);
      } catch (err) {
        console.warn(`⚠️ No se pudieron traer mensajes de ${contacto.uuid}:`, err.message);
        continue;
      }

      const mensajesNuevos = [];

      for (const msg of mensajes) {
        const fecha = new Date(msg.createdAt);
        if (isNaN(fecha)) {
          console.warn(`❌ Fecha inválida para mensaje:`, msg);
          continue;
        }

        if (!msg.text && !msg.attachments?.length) {
          console.log(`📭 Mensaje descartado (vacío):`, msg.id || msg);
          continue;
        }

        const yaExiste = await MessageByPhone.exists({
          contact_id: contacto.uuid,
          timestamp: fecha,
          message: msg.text || '',
        });

        if (!yaExiste) {
          const doc = {
            contact_name: contacto.name || '',
            phone: contacto.phoneNumber || '',
            contact_id: contacto.uuid,
            timestamp: fecha,
            sender: obtenerSender(msg),
            channel: msg.channel || '',
            message: msg.text || '',
            attachment_url: msg.attachments?.[0]?.payload?.url || '',
          };
          mensajesNuevos.push(doc);
        } else {
          totalOmitidos++;
        }
      }

      if (mensajesNuevos.length > 0) {
        try {
          await MessageByPhone.insertMany(mensajesNuevos, { ordered: false });
          totalInsertados += mensajesNuevos.length;
          console.log(`✅ Insertados ${mensajesNuevos.length} mensajes nuevos de ${contacto.name || contacto.uuid}`);
        } catch (e) {
          console.error('❌ Error al insertar mensajes:', e.message);
        }
      } else {
        console.log(`⏭ Sin mensajes nuevos para ${contacto.name || contacto.uuid}`);
      }
    }

    page++;
  }

  console.log(`\n🎉 Finalizado.`);
  console.log(`💾 Total insertados: ${totalInsertados}`);
  console.log(`⛔ Total omitidos por duplicados: ${totalOmitidos}`);
  mongoose.disconnect();
}

async function fetchMessagesByContact(contactId) {
  let allMessages = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const res = await fetch(`${API_BASE_URL}/contacts/${contactId}/messages?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn(`⚠️ Error parseando mensajes del contacto ${contactId}`);
      break;
    }

    if (!data.messages || data.messages.length === 0) break;

    allMessages.push(...data.messages);
    if (data.messages.length < limit) break;

    page++;
  }

  return allMessages;
}
