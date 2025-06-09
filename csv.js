const fs = require('fs');
const fetch = require('node-fetch');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const API_BASE_URL = 'https://api.callbell.eu/v1';
const API_KEY = 'Bearer zgrKCNQV9FF4MGQP2j6MUFMdpwu15qbV.d3c77927d30a5dfded57631d741757868065812a7dec2be9436aaf8f71985fa6';
const csvPath = 'mensajesfindemes.csv';

const csvWriter = createCsvWriter({
  path: csvPath,
  header: [
    { id: 'uuid', title: 'uuid' },
    { id: 'contact_name', title: 'contact_name' },
    { id: 'phone', title: 'phone' },
    { id: 'contact_id', title: 'contact_id' },
    { id: 'timestamp', title: 'timestamp' },
    { id: 'sender', title: 'sender' },
    { id: 'channel', title: 'channel' },
    { id: 'message', title: 'message' },
    { id: 'attachment_url', title: 'attachment_url' },
  ],
  append: fs.existsSync(csvPath),
});

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn(`❌ Error al traer ${url} (reintento ${i + 1}/${retries}): ${err.message}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return null;
}

async function run() {
  let page = 1;

  while (true) {
    console.log(`📞 Página de contactos: ${page}`);
    const data = await fetchWithRetry(`${API_BASE_URL}/contacts?page=${page}&limit=100`, {
      headers: { Authorization: API_KEY }
    });

    if (!data || !data.contacts || data.contacts.length === 0) {
      console.log('✅ Fin del listado de contactos.');
      break;
    }

    for (const contacto of data.contacts) {
      const mensajesData = await fetchWithRetry(`${API_BASE_URL}/contacts/${contacto.uuid}/messages`, {
        headers: { Authorization: API_KEY }
      });

      if (!mensajesData || !mensajesData.messages) continue;

      for (const msg of mensajesData.messages) {
        const registro = {
          uuid: msg.uuid || '',
          contact_name: contacto.name || '',
          phone: contacto.phoneNumber || '',
          contact_id: contacto.uuid,
          timestamp: new Date(msg.createdAt).toISOString(),
          sender:
            msg.status === 'received' ? 'cliente' :
            msg.status === 'sent'     ? 'nosotros' :
            msg.status === 'note'     ? 'sistema' : 'desconocido',
          channel: msg.channel || '',
          message: msg.text || '',
          attachment_url: msg.attachments?.[0]?.payload?.url || ''
        };

        await csvWriter.writeRecords([registro]);
        console.log('💾 Guardado en CSV:', registro);
      }

      await new Promise(r => setTimeout(r, 200)); // ⏳ evita saturar Callbell
    }

    page++;
  }

  console.log('\n🎉 Proceso finalizado. Todos los mensajes fueron guardados.');
}

run();
