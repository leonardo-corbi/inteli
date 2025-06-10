const express = require('express');
const router = express.Router();

// Controllers
const UserApiController = require('../../controllers/api/userApiController');

// Middleware
const { 
    authenticateToken,
    requireAdmin,
    requireOwnerOrAdmin,
    validateRequired, 
    validateEmail, 
    validatePassword,
    pagination
} = require('../../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/users - Listar usuários (apenas admin)
router.get('/', [requireAdmin, pagination], UserApiController.index);

// GET /api/users/search - Buscar usuários (autocomplete)
router.get('/search', UserApiController.search);

// GET /api/users/stats - Estatísticas de usuários (apenas admin)
router.get('/stats', requireAdmin, UserApiController.stats);

// GET /api/users/recent - Usuários recentes (apenas admin)
router.get('/recent', requireAdmin, UserApiController.recent);

// POST /api/users - Criar usuário (apenas admin)
router.post('/', [
    requireAdmin,
    validateRequired(['nome', 'email', 'matricula', 'senha']),
    validateEmail,
    validatePassword
], UserApiController.create);

// GET /api/users/:id - Buscar usuário por ID (próprio usuário ou admin)
router.get('/:id', requireOwnerOrAdmin, UserApiController.show);

// PUT /api/users/:id - Atualizar usuário (próprio usuário ou admin)
router.put('/:id', [
    requireOwnerOrAdmin,
    validateEmail
], UserApiController.update);

// DELETE /api/users/:id - Deletar usuário (apenas admin)
router.delete('/:id', requireAdmin, UserApiController.delete);

// PATCH /api/users/:id/status - Alterar status do usuário (apenas admin)
router.patch('/:id/status', requireAdmin, UserApiController.toggleStatus);

// GET /api/users/:id/reservations - Obter reservas do usuário
router.get('/:id/reservations', requireOwnerOrAdmin, UserApiController.reservations);

// GET /api/users/:id/logs - Obter logs do usuário
router.get('/:id/logs', requireOwnerOrAdmin, UserApiController.logs);

module.exports = router;

