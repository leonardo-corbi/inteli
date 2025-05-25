const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.post("/edit/:id", controller.updateUser);
router.post("/delete/:id", controller.deleteUser);

module.exports = router;
