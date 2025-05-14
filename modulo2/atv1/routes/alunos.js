const express = require("express");
const router = express.Router();
const controller = require("../controllers/alunoController.js");

router.get("/", controller.index);
router.post("/", controller.store);
router.post("/edit/:id", controller.update);
router.post("/delete/:id", controller.destroy);
router.get("/curso/:curso_id", controller.byCurso);

module.exports = router;
