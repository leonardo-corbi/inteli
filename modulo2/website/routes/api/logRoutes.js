const express = require('express');
const router = express.Router();

// Controllers
const LogApiController = require('../../controllers/api/logApiController');

// Middleware
const { 
    authenticateToken,
    requireAdmin,
    validateRequired,
    pagination
} = require('../../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/logs - Listar logs (apenas admin)
router.get('/', [requireAdmin, pagination], LogApiController.index);

// GET /api/logs/my - Meus logs
router.get('/my', LogApiController.myLogs);

// GET /api/logs/search - Buscar logs
router.get('/search', requireAdmin, LogApiController.search);

// GET /api/logs/stats - Estatísticas de logs (apenas admin)
router.get('/stats', requireAdmin, LogApiController.stats);

// GET /api/logs/recent - Logs recentes
router.get('/recent', LogApiController.recent);

// GET /api/logs/activity - Atividade por período (apenas admin)
router.get('/activity', requireAdmin, LogApiController.activity);

// GET /api/logs/period - Logs por período (apenas admin)
router.get('/period', requireAdmin, LogApiController.byPeriod);

// POST /api/logs - Criar log
router.post('/', [
    validateRequired(['reserva_id', 'descricao'])
], LogApiController.create);

// GET /api/logs/:id - Buscar log por ID (apenas admin)
router.get('/:id', requireAdmin, LogApiController.show);

// DELETE /api/logs/:id - Deletar log (apenas admin)
router.delete('/:id', requireAdmin, LogApiController.delete);

// GET /api/logs/reservation/:reserva_id - Logs por reserva
router.get('/reservation/:reserva_id', LogApiController.byReservation);

// GET /api/logs/user/:user_id - Logs por usuário
router.get('/user/:user_id', LogApiController.byUser);

module.exports = router;

