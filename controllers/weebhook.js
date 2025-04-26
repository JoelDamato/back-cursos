const axios = require('axios');
const Crm = require('../models/Crm'); // Asegurate que esta es la ruta correcta a tu modelo Crm

/* ======================
   Helper functions
   ====================== */

const getTextValue = (prop) => {
  if (!prop) return '';
  if (prop.type === 'title') return prop.title.map((item) => item.plain_text).join(' ');
  if (prop.type === 'rich_text') return prop.rich_text.map((item) => item.plain_text).join(' ');
  return '';
};

const getNumber = (prop) => prop?.number ?? null;
const getSelectValue = (prop) => prop?.select?.name ?? '';
const getCheckbox = (prop) => prop?.checkbox ?? false;
const getDate = (prop) => prop?.date?.start ?? null;
const getRelation = (prop) => prop?.relation?.map((rel) => rel.id) ?? [];

const formatNotionId = (id) => {
  if (!id) return id;
  if (id.includes('-')) return id;
  if (id.length === 32) {
    return id.replace(
      /([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})/,
      '$1-$2-$3-$4-$5'
    );
  }
  return id;
};

/* ======================
   Webhook Controller
   ====================== */

exports.handleWebhook = async (req, res) => {
  try {
    console.log("Webhook recibido:");
    console.log(JSON.stringify(req.body, null, 2));

    const { data } = req.body;
    if (!data || !data.id || !data.properties) {
      console.error("❌ Datos inválidos en el payload");
      return res.status(400).json({ error: 'Datos inválidos o incompletos en la solicitud' });
    }

    const pageId = data.id;
    const normalizedPageId = formatNotionId(pageId);
    const props = data.properties;

    const transformedData = {
      id: normalizedPageId,
      nombre: getTextValue(props['Nombre cliente']),
      telefono: getTextValue(props['Telefono']),
      email: getTextValue(props['Email']),
      origen: getSelectValue(props['Origen']),
      estado: getSelectValue(props['Estado']),
      agenda: getCheckbox(props['Agenda']),
      fechaAgendamiento: getDate(props['Fecha de agendamiento']),
      producto: getSelectValue(props['Producto Adquirido']),
      precio: getNumber(props['Precio']),
      cashCollected: getNumber(props['Cash Collected']),
      fechaCreada: getDate(props['Fecha creada'])
    };

    const existingDocument = await Crm.findOne({ id: normalizedPageId });
    const operationType = existingDocument ? 'actualizado' : 'creado';

    const updatedOrCreatedData = await Crm.findOneAndUpdate(
      { id: normalizedPageId },
      transformedData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      message: `Datos ${operationType} con éxito`,
      operation: operationType,
      data: updatedOrCreatedData
    });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return res.status(500).json({ error: "Error al procesar los datos del webhook" });
  }
};
