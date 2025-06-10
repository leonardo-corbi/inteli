const express = require('express');
const router = express.Router();

// Middleware
const { corsMiddleware, errorHandler } = require('../../middleware/auth');

// Aplicar CORS para todas as rotas de API
router.use(corsMiddleware);

// Rota de status da API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API do Sistema de Reserva de Salas',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            rooms: '/api/rooms',
            reservations: '/api/reservations',
            logs: '/api/logs'
        }
    });
});

// Rota de health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Importar e usar rotas específicas
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/rooms', require('./roomRoutes'));
router.use('/reservations', require('./reservationRoutes'));
router.use('/logs', require('./logRoutes'));

// Middleware de tratamento de erros (deve ser o último)
router.use(errorHandler);

// Rota 404 para APIs não encontradas
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint não encontrado',
        message: 'Verifique a documentação da API para endpoints disponíveis'
    });
});

module.exports = router;

