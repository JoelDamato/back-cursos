const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crearLinkDePago = async (req, res) => {
  const { title, price, nombre, email } = req.body;

  if (!title || !price || !nombre || !email) {
    return res.status(400).json({ error: "Faltan datos: title, price, nombre y email son obligatorios" });
  }

  try {
    const encodedEmail = encodeURIComponent(email);
    const encodedNombre = encodeURIComponent(nombre);

    const successUrl = `https://www.erickgomezacademy.com/success?email=${encodedEmail}&nombre=${encodedNombre}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'ars', // o 'usd' si facturás en dólares
            product_data: {
              name: title,
              description: 'Pago generado desde el sitio',
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: 'https://www.erickgomezacademy.com/cancelado',
    });

    return res.status(200).json({ link: session.url });
  } catch (error) {
    console.error("❌ Error al crear link de pago con Stripe:", error);
    res.status(500).json({ error: "No se pudo generar el link de pago" });
  }
};

module.exports = crearLinkDePago;
