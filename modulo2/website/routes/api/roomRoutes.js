const express = require('express');
const router = express.Router();

// Controllers
const RoomApiController = require('../../controllers/api/roomApiController');

// Middleware
const { 
    authenticateToken,
    requireAdmin,
    validateRequired,
    pagination
} = require('../../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/rooms - Listar salas
router.get('/', pagination, RoomApiController.index);

// GET /api/rooms/search - Buscar salas (autocomplete)
router.get('/search', RoomApiController.search);

// GET /api/rooms/available - Buscar salas disponíveis
router.get('/available', RoomApiController.available);

// GET /api/rooms/stats - Estatísticas de salas
router.get('/stats', RoomApiController.stats);

// GET /api/rooms/most-used - Salas mais utilizadas
router.get('/most-used', RoomApiController.mostUsed);

// POST /api/rooms - Criar sala (apenas admin)
router.post('/', [
    requireAdmin,
    validateRequired(['nome', 'localizacao', 'capacidade'])
], RoomApiController.create);

// GET /api/rooms/:id - Buscar sala por ID
router.get('/:id', RoomApiController.show);

// PUT /api/rooms/:id - Atualizar sala (apenas admin)
router.put('/:id', requireAdmin, RoomApiController.update);

// DELETE /api/rooms/:id - Deletar sala (apenas admin)
router.delete('/:id', requireAdmin, RoomApiController.delete);

// GET /api/rooms/:id/availability - Verificar disponibilidade da sala
router.get('/:id/availability', RoomApiController.checkAvailability);

// GET /api/rooms/:id/reservations - Obter reservas da sala
router.get('/:id/reservations', RoomApiController.reservations);

// GET /api/rooms/:id/schedule - Obter agenda da sala
router.get('/:id/schedule', RoomApiController.schedule);

module.exports = router;

