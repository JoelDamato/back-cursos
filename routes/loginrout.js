const express = require('express');
const loginUser = require('../controllers/login');


// Crear el router
const router = express.Router();
// Definir la ruta para el login
router.post('/login', loginUser);


module.exports = router;
