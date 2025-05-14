const express = require("express");
const router = express.Router();
const home = require("../controllers/homeController.js");
const about = require("../controllers/aboutController.js");
const contact = require("../controllers/contactController.js");

// Rota principal
router.get("/", home.index);

// Rota da página "Sobre"
router.get("/sobre", about.index);

// Rota da página "Contato"
router.get("/contato", contact.index);

module.exports = router;
