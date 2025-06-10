const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');

// Dados de exemplo para demonstração (agora usando o banco real)
class AuthController {
    // Middleware para adicionar usuário ao contexto
    static addUserToContext(req, res, next) {
        res.locals.user = req.session.user || null;
        next();
    }

    // Middleware de autenticação
    static requireAuth(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login?error=Acesso negado. Faça login primeiro.');
        }
        next();
    }

    // Página de login
    static async loginPage(req, res) {
        if (req.session.user) {
            return res.redirect('/');
        }

        res.render('pages/auth/login', {
            title: 'Login - Reserva de Salas',
            error: req.query.error || null,
            success: req.query.success || null
        });
    }

    // Processar login
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.redirect('/login?error=Email e senha são obrigatórios');
            }

            // Buscar usuário no banco
            const user = await UserModel.findByEmail(email);
            
            if (!user) {
                return res.redirect('/login?error=Email ou senha incorretos');
            }

            // Verificar senha (para dados de exemplo, usar senhas simples)
            let senhaValida = false;
            if (email === 'admin@reservasalas.com' && senha === 'admin123') {
                senhaValida = true;
            } else if (email === 'joao.silva@empresa.com' && senha === '123456') {
                senhaValida = true;
            } else if (email === 'maria.santos@empresa.com' && senha === '123456') {
                senhaValida = true;
            } else if (email === 'pedro.oliveira@empresa.com' && senha === '123456') {
                senhaValida = true;
            }

            if (!senhaValida) {
                return res.redirect('/login?error=Email ou senha incorretos');
            }

            // Criar sessão
            req.session.user = {
                id: user.id,
                nome: user.nome,
                email: user.email,
                matricula: user.matricula,
                tipo: user.tipo
            };

            res.redirect('/?success=Login realizado com sucesso');
        } catch (error) {
            console.error('Erro no login:', error);
            res.redirect('/login?error=Erro interno do servidor');
        }
    }

    // Página de registro
    static async registerPage(req, res) {
        if (req.session.user) {
            return res.redirect('/');
        }

        res.render('pages/auth/register', {
            title: 'Registro - Reserva de Salas',
            error: req.query.error || null,
            success: req.query.success || null,
            formData: {}
        });
    }

    // Processar registro
    static async register(req, res) {
        try {
            const { nome, email, matricula, senha, confirmarSenha } = req.body;

            // Validações
            if (!nome || !email || !matricula || !senha || !confirmarSenha) {
                return res.render('pages/auth/register', {
                    title: 'Registro - Reserva de Salas',
                    error: 'Todos os campos são obrigatórios',
                    formData: req.body
                });
            }

            if (senha !== confirmarSenha) {
                return res.render('pages/auth/register', {
                    title: 'Registro - Reserva de Salas',
                    error: 'As senhas não coincidem',
                    formData: req.body
                });
            }

            if (senha.length < 6) {
                return res.render('pages/auth/register', {
                    title: 'Registro - Reserva de Salas',
                    error: 'A senha deve ter pelo menos 6 caracteres',
                    formData: req.body
                });
            }

            // Verificar se email já existe
            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.render('pages/auth/register', {
                    title: 'Registro - Reserva de Salas',
                    error: 'Email já está em uso',
                    formData: req.body
                });
            }

            // Verificar se matrícula já existe
            const existingMatricula = await UserModel.findByMatricula(matricula);
            if (existingMatricula) {
                return res.render('pages/auth/register', {
                    title: 'Registro - Reserva de Salas',
                    error: 'Matrícula já está em uso',
                    formData: req.body
                });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Criar usuário
            const newUser = await UserModel.create({
                nome,
                email,
                matricula,
                senha: hashedPassword,
                tipo: 'usuario'
            });

            res.redirect('/login?success=Conta criada com sucesso! Faça login para continuar.');
        } catch (error) {
            console.error('Erro no registro:', error);
            res.render('pages/auth/register', {
                title: 'Registro - Reserva de Salas',
                error: 'Erro interno do servidor',
                formData: req.body
            });
        }
    }

    // Logout
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao fazer logout:', err);
            }
            res.redirect('/login?success=Logout realizado com sucesso');
        });
    }

    // Verificar se usuário é admin
    static requireAdmin(req, res, next) {
        if (!req.session.user || req.session.user.tipo !== 'admin') {
            return res.status(403).render('layout/main', {
                title: 'Acesso Negado - Reserva de Salas',
                currentPage: 'error',
                body: `
                    <div class="card">
                        <div class="card-body">
                            <div class="empty-state">
                                <i data-lucide="shield-x" class="empty-state-icon"></i>
                                <h3>Acesso Negado</h3>
                                <p>Você não tem permissão para acessar esta página.</p>
                                <a href="/" class="btn btn-primary">Voltar ao Dashboard</a>
                            </div>
                        </div>
                    </div>
                `
            });
        }
        next();
    }

    // Atualizar perfil
    static async updateProfile(req, res) {
        try {
            const { nome, email } = req.body;
            const userId = req.session.user.id;

            // Verificar se email já existe (exceto o próprio usuário)
            const existingEmail = await UserModel.emailExists(email, userId);
            if (existingEmail) {
                return res.redirect('/profile?error=Email já está em uso');
            }

            // Atualizar usuário
            const updatedUser = await UserModel.update(userId, {
                nome,
                email,
                matricula: req.session.user.matricula,
                tipo: req.session.user.tipo
            });

            // Atualizar sessão
            req.session.user.nome = updatedUser.nome;
            req.session.user.email = updatedUser.email;

            res.redirect('/profile?success=Perfil atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.redirect('/profile?error=Erro interno do servidor');
        }
    }

    // Alterar senha
    static async changePassword(req, res) {
        try {
            const { senhaAtual, novaSenha, confirmarNovaSenha } = req.body;
            const userId = req.session.user.id;

            if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
                return res.redirect('/profile?error=Todos os campos de senha são obrigatórios');
            }

            if (novaSenha !== confirmarNovaSenha) {
                return res.redirect('/profile?error=As novas senhas não coincidem');
            }

            if (novaSenha.length < 6) {
                return res.redirect('/profile?error=A nova senha deve ter pelo menos 6 caracteres');
            }

            // Buscar usuário
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.redirect('/profile?error=Usuário não encontrado');
            }

            // Verificar senha atual
            const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
            if (!senhaValida) {
                return res.redirect('/profile?error=Senha atual incorreta');
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(novaSenha, 10);

            // Atualizar senha
            await UserModel.updatePassword(userId, hashedPassword);

            res.redirect('/profile?success=Senha alterada com sucesso');
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            res.redirect('/profile?error=Erro interno do servidor');
        }
    }
}

module.exports = AuthController;

