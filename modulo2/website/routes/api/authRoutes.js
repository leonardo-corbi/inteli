const express = require('express');
const router = express.Router();

// Controllers
const AuthApiController = require('../../controllers/api/authApiController');

// Middleware
const { 
    validateRequired, 
    validateEmail, 
    validatePassword,
    authenticateToken 
} = require('../../middleware/auth');

// Rotas públicas (sem autenticação)

// POST /api/auth/register - Registrar usuário
router.post('/register', [
    validateRequired(['nome', 'email', 'matricula', 'senha']),
    validateEmail,
    validatePassword
], AuthApiController.register);

// POST /api/auth/login - Login
router.post('/login', [
    validateRequired(['email', 'senha'])
], AuthApiController.login);

// POST /api/auth/forgot-password - Esqueci minha senha
router.post('/forgot-password', [
    validateRequired(['email']),
    validateEmail
], AuthApiController.forgotPassword);

// POST /api/auth/reset-password - Redefinir senha
router.post('/reset-password', [
    validateRequired(['token', 'nova_senha']),
    validatePassword
], AuthApiController.resetPassword);

// Rotas protegidas (requerem autenticação)

// GET /api/auth/verify - Verificar token
router.get('/verify', authenticateToken, AuthApiController.verifyToken);

// POST /api/auth/refresh - Renovar token
router.post('/refresh', authenticateToken, AuthApiController.refreshToken);

// POST /api/auth/logout - Logout
router.post('/logout', authenticateToken, AuthApiController.logout);

// GET /api/auth/profile - Obter perfil
router.get('/profile', authenticateToken, AuthApiController.profile);

// PUT /api/auth/profile - Atualizar perfil
router.put('/profile', [
    authenticateToken,
    validateEmail
], AuthApiController.updateProfile);

// POST /api/auth/change-password - Alterar senha
router.post('/change-password', [
    authenticateToken,
    validateRequired(['senha_atual', 'nova_senha']),
    validatePassword
], AuthApiController.changePassword);

module.exports = router;

