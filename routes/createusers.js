const express = require('express');
const createUser = require('../controllers/createuser');
const createUserAuto = require('../controllers/createuserauto');
// Crear el router
const router = express.Router();

// Definir la ruta para el registro
router.post('/register', createUser);
router.post('/registerauto', createUserAuto);

module.exports = router;
