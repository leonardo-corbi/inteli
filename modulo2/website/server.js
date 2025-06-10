const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS para APIs
app.use('/api', cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false
}));

// Configuração de sessão para rotas web
app.use(session({
    secret: process.env.JWT_SECRET || 'reserva-salas-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true apenas em HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Middleware para disponibilizar dados globais nas views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.currentPage = req.path.split('/')[1] || 'dashboard';
    next();
});

// Rotas da API (devem vir antes das rotas web)
app.use('/api', require('./routes/api'));

// Rotas web
app.use('/', require('./routes/frontRoutes'));

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    
    // Se for uma requisição de API
    if (req.path.startsWith('/api')) {
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
    
    // Se for uma requisição web
    res.status(500).render('pages/error', {
        title: 'Erro - Reserva de Salas',
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado. Tente novamente.'
    });
});

// Rota 404 para páginas não encontradas
app.use((req, res) => {
    // Se for uma requisição de API
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            error: 'Endpoint não encontrado'
        });
    }
    
    // Se for uma requisição web
    res.status(404).render('pages/error', {
        title: 'Página não encontrada - Reserva de Salas',
        error: 'Página não encontrada',
        message: 'A página que você está procurando não existe.'
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 API disponível em http://localhost:${PORT}/api`);
    console.log(`🌐 Interface web em http://localhost:${PORT}`);
    console.log(`💾 Banco: PostgreSQL (${process.env.DB_HOST})`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : 'Usando padrão'}`);
});

module.exports = app;

