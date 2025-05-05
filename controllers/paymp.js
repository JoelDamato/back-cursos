const { MercadoPagoConfig, Preference } = require("mercadopago");

const mercadopago = new MercadoPagoConfig({
  accessToken: "APP_USR-855812405074472-050316-5b28ebd67507765d36e67823798b1d0e-1236486449"
});

const crearLinkDePago = async (req, res) => {
  const { title, price, nombre, email } = req.body;

  if (!title || !price || !nombre || !email) {
    return res.status(400).json({ error: "Faltan datos: title, price, nombre y email son obligatorios" });
  }

  try {
    const encodedEmail = encodeURIComponent(email);
    const encodedNombre = encodeURIComponent(nombre);

    const successUrl = `https://www.erickgomezacademy.com/success?email=${encodedEmail}&nombre=${encodedNombre}`;

    const preferenceClient = new Preference(mercadopago);

    const response = await preferenceClient.create({
      body: {
        items: [
          {
            title,
            description: "Pago generado desde el sitio",
            unit_price: parseFloat(price),
            currency_id: "ARS",
            quantity: 1
          }
        ],
        back_urls: {
          success: successUrl,
          failure: "",
          pending: ""
        },
        auto_return: "approved"
      }
    });

    return res.status(200).json({ link: response.init_point });
  } catch (error) {
    console.error("❌ Error al crear link de pago:", error);
    res.status(500).json({ error: "No se pudo generar el link de pago" });
  }
};

module.exports = crearLinkDePago;
