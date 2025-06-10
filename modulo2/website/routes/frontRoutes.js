const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const HomeController = require('../controllers/homeController');
const RoomController = require('../controllers/roomController');
const ReservationController = require('../controllers/reservationController');
const UserController = require('../controllers/userController');

// Middleware para adicionar usuário ao contexto
router.use(AuthController.addUserToContext);

// Rotas de autenticação (públicas)
router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.get('/register', AuthController.registerPage);
router.post('/register', AuthController.register);
router.get('/logout', AuthController.logout);

// Middleware de autenticação para rotas protegidas
router.use(AuthController.requireAuth);

// Rotas principais (protegidas)
router.get('/', HomeController.index);

// Rotas de salas
router.get('/rooms', RoomController.index);
router.get('/rooms/create', RoomController.createPage);
router.post('/rooms', RoomController.create);
router.get('/rooms/:id', RoomController.show);
router.get('/rooms/:id/edit', RoomController.editPage);
router.put('/rooms/:id', RoomController.update);
router.delete('/rooms/:id', RoomController.delete);

// Rotas de reservas
router.get('/reservations', ReservationController.index);
router.get('/reservations/create', ReservationController.createPage);
router.post('/reservations', ReservationController.create);
router.get('/reservations/:id', ReservationController.show);
router.get('/reservations/:id/edit', ReservationController.editPage);
router.put('/reservations/:id', ReservationController.update);
router.delete('/reservations/:id', ReservationController.delete);
router.patch('/reservations/:id/cancel', ReservationController.cancel);

// Rotas de usuários
router.get('/users', UserController.index);
router.get('/users/create', UserController.createPage);
router.post('/users', UserController.create);
router.get('/users/:id', UserController.show);
router.get('/users/:id/edit', UserController.editPage);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

// Rotas de API para AJAX
router.get('/api/rooms/availability', RoomController.checkAvailability);
router.get('/api/reservations/conflicts', ReservationController.checkConflicts);

module.exports = router;

