const express = require('express');
const router = express.Router();

// Controllers
const ReservationApiController = require('../../controllers/api/reservationApiController');

// Middleware
const { 
    authenticateToken,
    requireAdmin,
    validateRequired,
    validateDate,
    pagination
} = require('../../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/reservations - Listar reservas
router.get('/', pagination, ReservationApiController.index);

// GET /api/reservations/my - Minhas reservas
router.get('/my', ReservationApiController.myReservations);

// GET /api/reservations/stats - Estatísticas de reservas
router.get('/stats', ReservationApiController.stats);

// GET /api/reservations/upcoming - Reservas próximas
router.get('/upcoming', ReservationApiController.upcoming);

// GET /api/reservations/today - Reservas de hoje
router.get('/today', ReservationApiController.today);

// GET /api/reservations/period - Reservas por período
router.get('/period', ReservationApiController.byPeriod);

// GET /api/reservations/calendar - Eventos para calendário
router.get('/calendar', ReservationApiController.calendarEvents);

// GET /api/reservations/conflicts - Verificar conflitos
router.get('/conflicts', ReservationApiController.checkConflicts);

// POST /api/reservations - Criar reserva
router.post('/', [
    validateRequired(['sala_id', 'usuario_id', 'data_inicio', 'data_fim']),
    validateDate
], ReservationApiController.create);

// GET /api/reservations/:id - Buscar reserva por ID
router.get('/:id', ReservationApiController.show);

// PUT /api/reservations/:id - Atualizar reserva
router.put('/:id', validateDate, ReservationApiController.update);

// DELETE /api/reservations/:id - Deletar reserva
router.delete('/:id', ReservationApiController.delete);

// PATCH /api/reservations/:id/cancel - Cancelar reserva
router.patch('/:id/cancel', ReservationApiController.cancel);

// GET /api/reservations/:id/logs - Obter logs da reserva
router.get('/:id/logs', ReservationApiController.logs);

module.exports = router;

