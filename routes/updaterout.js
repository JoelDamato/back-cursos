// Importar los módulos necesarios
const express = require('express');
const editUser = require('../controllers/updateuser');
const editUser2 = require('../controllers/editpassword');
const { deleteUserByEmail } = require('../controllers/deleteuser');
const { updateImagenPerfil } = require('../controllers/updateImagenPerfil');

// Crear el router
const router = express.Router();

// Definir la ruta para editar un usuario
router.put('/users/:email', editUser);
router.put('/password/:email', editUser2);
router.delete('/usuarios', deleteUserByEmail);
router.put('/user/imagen-perfil', updateImagenPerfil);

module.exports = router;