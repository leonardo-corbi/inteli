const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomController");

router.get("/", controller.getAllRooms);
router.get("/:id", controller.getRoomById);
router.post("/", controller.createRoom);
router.post("/edit/:id", controller.updateRoom);
router.post("/delete/:id", controller.deleteRoom);

module.exports = router;
