const express = require('express');
const getUserDataByEmail = require('../controllers/search.js');
const gettotals = require('../controllers/totalsuser.js')
const getAllUsers = require("../controllers/getallusers");



// Crear el router
const router = express.Router();

// Definir la ruta para el registro
router.get("/usuarios", getAllUsers);
router.post('/users', getUserDataByEmail );
router.get('/totalsusers', gettotals )

module.exports = router;
