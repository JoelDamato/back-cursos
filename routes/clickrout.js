const express = require("express");
const router = express.Router();

const registrarClick = require("../controllers/Clickcontroller.js");
const obtenerTodosLosClicks = require("../controllers/getclick.js");
const registrarProgreso = require("../controllers/progrescontroller.js");
const obtenerProgresoPorUsuario = require("../controllers/getprogres.js");
const crearLinkDePago = require("../controllers/paymp.js");
const { createOnboarding, checkIfCompleted } = require("../controllers/Onboardingcontroller.js");
const { guardarDisparo, obtenerDisparos } = require('../controllers/disparosController');
const sendResetPasswordLink = require('../controllers/resetpassword.js');



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


router.post('/disparos', guardarDisparo);
router.get('/disparos', obtenerDisparos); // opcional

router.post('/send-reset-password', sendResetPasswordLink);

module.exports = router;
