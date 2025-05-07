const express = require("express");
const router = express.Router();

const registrarClick = require("../controllers/Clickcontroller.js");
const obtenerTodosLosClicks = require("../controllers/getclick.js");
const registrarProgreso = require("../controllers/progrescontroller.js");
const obtenerProgresoPorUsuario = require("../controllers/getprogres.js");
const crearLinkDePago = require("../controllers/paymp.js");
const { createOnboarding, checkIfCompleted } = require("../controllers/Onboardingcontroller.js");


// Clicks
router.post("/clicks", registrarClick);
router.get("/getclicks", obtenerTodosLosClicks);

// Progreso
router.post("/progreso", registrarProgreso);
router.get("/progresoget", obtenerProgresoPorUsuario);
router.post("/generate-link", crearLinkDePago);

//form onboardin
router.post("/onboarding", createOnboarding);
router.get("/onboarding", checkIfCompleted);



module.exports = router;
