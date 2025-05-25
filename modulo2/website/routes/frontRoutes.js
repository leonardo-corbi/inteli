const express = require('express');
const router = express.Router();
const path = require('path');
const roomService = require('../services/roomService');
const reservationService = require('../services/reservationService');

router.get('/', async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    const reservations = await reservationService.getAllReservations();
    res.render(path.join(__dirname, '../views/layout/main'), {
      pageTitle: 'Reserva de Salas',
      content: path.join(__dirname, '../views/pages/index'),
      rooms,
      reservations
    });
  } catch (error) {
    console.error('Erro ao carregar a página inicial:', error);
    res.status(500).send('Erro ao carregar a página inicial');
  }
});

router.get('/about', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Sobre o Sistema de Reserva de Salas',
    content: path.join(__dirname, '../views/pages/about')
  });
});

module.exports = router;