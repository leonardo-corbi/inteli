const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationController");

router.get("/", controller.getAllReservations);
router.get("/:id", controller.getReservationById);
router.post("/", controller.createReservation);
router.post("/edit/:id", controller.updateReservation);
router.post("/delete/:id", controller.deleteReservation);

module.exports = router;
