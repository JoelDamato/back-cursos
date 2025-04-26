const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/weebhook'); // Asegurate que la ruta esté bien

router.post('/', handleWebhook); // Ruta POST en "/webhook"

module.exports = router;
