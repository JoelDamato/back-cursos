const express = require("express");
const router = express.Router();

const registrarClick = require("../controllers/Clickcontroller.js");
const obtenerTodosLosClicks = require("../controllers/getclick.js");
const registrarProgreso = require("../controllers/progrescontroller.js");
const obtenerProgresoPorUsuario = require("../controllers/getprogres.js");

// Clicks
router.post("/clicks", registrarClick);
router.get("/getclicks", obtenerTodosLosClicks);

// Progreso
router.post("/progreso", registrarProgreso);
router.get("/progresoget", obtenerProgresoPorUsuario);

module.exports = router;
