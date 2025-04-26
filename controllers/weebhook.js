const Crm = require('../models/Crm'); // Importa tu schema Crm

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
    const normalizedPageId = pageId; // O usa formatNotionId si necesitás formatearlo

    // Guarda TODO el objeto properties directamente
    const crmData = {
      id: normalizedPageId,
      creadoEn: new Date(), // Podés guardar la fecha actual o usar alguna fecha del webhook
      properties: data.properties // Guarda todas las propiedades sin procesar
    };

    // Upsert (crear o actualizar)
    const result = await Crm.findOneAndUpdate(
      { id: normalizedPageId },
      crmData,
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: 'Datos guardados con éxito',
      data: result
    });

  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return res.status(500).json({ error: "Error al procesar el webhook" });
  }
};
