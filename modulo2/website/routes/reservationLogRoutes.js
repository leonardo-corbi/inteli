const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservationLogController");

router.get("/", controller.getAllReservationLogs);
router.get("/:id", controller.getReservationLogById);
router.get("/reservation/:reserva_id", controller.getLogsByReservationId);
router.post("/", controller.createReservationLog);
router.post("/delete/:id", controller.deleteReservationLog);

module.exports = router;
