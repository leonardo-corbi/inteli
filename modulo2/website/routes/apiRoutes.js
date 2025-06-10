const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');
const RoomController = require('../controllers/roomController');

// API de estatísticas
router.get('/api/stats', HomeController.apiStats);

// API de salas
router.get('/api/rooms', RoomController.apiIndex);
router.get('/api/rooms/:id', RoomController.apiShow);

module.exports = router;

