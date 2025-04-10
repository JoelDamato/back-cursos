const express = require("express");
const router = express.Router();
const registrarClick = require("../controllers/Clickcontroller.js");
const obtenerTodosLosClicks = require("../controllers/getclick.js");

router.post("/clicks", registrarClick);
router.get("/getclicks", obtenerTodosLosClicks);

module.exports = router;
