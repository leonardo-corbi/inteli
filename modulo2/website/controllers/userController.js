const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

class UserController {
    // Listar todos os usuários
    static async index(req, res) {
        try {
            const filters = {
                search: req.query.search || '',
                tipo: req.query.tipo || ''
            };

            const users = await UserModel.findAll(filters);
            const totalUsers = await UserModel.count(filters);

            res.render('pages/users/index', {
                title: 'Usuários - Reserva de Salas',
                currentPage: 'users',
                user: req.session.user,
                users: users,
                totalUsers: totalUsers,
                filters: filters,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.render('pages/users/index', {
                title: 'Usuários - Reserva de Salas',
                currentPage: 'users',
                user: req.session.user,
                users: [],
                totalUsers: 0,
                filters: {},
                error: 'Erro ao carregar usuários'
            });
        }
    }

    // Página de criação de usuário
    static async createPage(req, res) {
        res.render('pages/users/create', {
            title: 'Novo Usuário - Reserva de Salas',
            currentPage: 'users',
            user: req.session.user,
            formData: {},
            error: req.query.error || null
        });
    }

    // Criar novo usuário
    static async create(req, res) {
        try {
            const { nome, email, matricula, tipo, senha, confirmar_senha } = req.body;

            // Validações
            if (!nome || !email || !matricula || !tipo || !senha || !confirmar_senha) {
                return res.render('pages/users/create', {
                    title: 'Novo Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Todos os campos são obrigatórios'
                });
            }

            if (senha !== confirmar_senha) {
                return res.render('pages/users/create', {
                    title: 'Novo Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Senhas não coincidem'
                });
            }

            if (senha.length < 6) {
                return res.render('pages/users/create', {
                    title: 'Novo Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Senha deve ter pelo menos 6 caracteres'
                });
            }

            // Verificar se email já existe
            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.render('pages/users/create', {
                    title: 'Novo Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Email já está em uso'
                });
            }

            // Verificar se matrícula já existe
            const existingMatricula = await UserModel.findByMatricula(matricula);
            if (existingMatricula) {
                return res.render('pages/users/create', {
                    title: 'Novo Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Matrícula já está em uso'
                });
            }

            // Criptografar senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            // Criar usuário
            const newUser = await UserModel.create({
                nome,
                email,
                matricula,
                tipo,
                senha: hashedPassword
            });

            res.redirect('/users?success=Usuário criado com sucesso');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.render('pages/users/create', {
                title: 'Novo Usuário - Reserva de Salas',
                currentPage: 'users',
                user: req.session.user,
                formData: req.body,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Página de edição de usuário
    static async editPage(req, res) {
        try {
            const { id } = req.params;
            const userData = await UserModel.findById(id);

            if (!userData) {
                return res.redirect('/users?error=Usuário não encontrado');
            }

            res.render('pages/users/edit', {
                title: 'Editar Usuário - Reserva de Salas',
                currentPage: 'users',
                user: req.session.user,
                userData: userData,
                formData: userData,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.redirect('/users?error=Erro ao carregar usuário');
        }
    }

    // Atualizar usuário
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, matricula, tipo, senha, confirmar_senha } = req.body;

            // Buscar usuário atual
            const currentUser = await UserModel.findById(id);
            if (!currentUser) {
                return res.redirect('/users?error=Usuário não encontrado');
            }

            // Validações
            if (!nome || !email || !matricula || !tipo) {
                return res.render('pages/users/edit', {
                    title: 'Editar Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    userData: currentUser,
                    formData: req.body,
                    error: 'Nome, email, matrícula e tipo são obrigatórios'
                });
            }

            // Se senha foi fornecida, validar
            if (senha) {
                if (senha !== confirmar_senha) {
                    return res.render('pages/users/edit', {
                        title: 'Editar Usuário - Reserva de Salas',
                        currentPage: 'users',
                        user: req.session.user,
                        userData: currentUser,
                        formData: req.body,
                        error: 'Senhas não coincidem'
                    });
                }

                if (senha.length < 6) {
                    return res.render('pages/users/edit', {
                        title: 'Editar Usuário - Reserva de Salas',
                        currentPage: 'users',
                        user: req.session.user,
                        userData: currentUser,
                        formData: req.body,
                        error: 'Senha deve ter pelo menos 6 caracteres'
                    });
                }
            }

            // Verificar se email já existe (exceto o próprio usuário)
            const emailExists = await UserModel.emailExists(email, id);
            if (emailExists) {
                return res.render('pages/users/edit', {
                    title: 'Editar Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    userData: currentUser,
                    formData: req.body,
                    error: 'Email já está em uso'
                });
            }

            // Verificar se matrícula já existe (exceto o próprio usuário)
            const matriculaExists = await UserModel.matriculaExists(matricula, id);
            if (matriculaExists) {
                return res.render('pages/users/edit', {
                    title: 'Editar Usuário - Reserva de Salas',
                    currentPage: 'users',
                    user: req.session.user,
                    userData: currentUser,
                    formData: req.body,
                    error: 'Matrícula já está em uso'
                });
            }

            // Preparar dados para atualização
            const updateData = {
                nome,
                email,
                matricula,
                tipo
            };

            // Se senha foi fornecida, criptografar
            if (senha) {
                updateData.senha = await bcrypt.hash(senha, 10);
            }

            // Atualizar usuário
            await UserModel.update(id, updateData);

            res.redirect('/users?success=Usuário atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.redirect(`/users/${req.params.id}/edit?error=Erro interno do servidor`);
        }
    }

    // Visualizar detalhes do usuário
    static async show(req, res) {
        try {
            const { id } = req.params;
            const userData = await UserModel.findById(id);

            if (!userData) {
                return res.redirect('/users?error=Usuário não encontrado');
            }

            // Buscar reservas do usuário
            const userReservations = await ReservationModel.findByUser(id, { limit: 10 });

            // Buscar logs do usuário
            const userLogs = await ReservationLogModel.findByUser(id, 10);

            res.render('pages/users/show', {
                title: `${userData.nome} - Reserva de Salas`,
                currentPage: 'users',
                user: req.session.user,
                userData: userData,
                userReservations: userReservations,
                userLogs: userLogs
            });
        } catch (error) {
            console.error('Erro ao visualizar usuário:', error);
            res.redirect('/users?error=Erro ao carregar usuário');
        }
    }

    // Deletar usuário
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se usuário existe
            const userData = await UserModel.findById(id);
            if (!userData) {
                return res.redirect('/users?error=Usuário não encontrado');
            }

            // Não permitir deletar o próprio usuário
            if (parseInt(id) === req.session.user.id) {
                return res.redirect('/users?error=Não é possível excluir seu próprio usuário');
            }

            // Verificar se há reservas ativas
            const activeReservations = await ReservationModel.findByUser(id, { status: 'ativa' });
            if (activeReservations.length > 0) {
                return res.redirect('/users?error=Não é possível excluir usuário com reservas ativas');
            }

            // Deletar usuário
            await UserModel.delete(id);

            res.redirect('/users?success=Usuário excluído com sucesso');
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.redirect('/users?error=Erro interno do servidor');
        }
    }

    // Alterar status do usuário (ativar/desativar)
    static async toggleStatus(req, res) {
        try {
            const { id } = req.params;

            // Verificar se usuário existe
            const userData = await UserModel.findById(id);
            if (!userData) {
                return res.redirect('/users?error=Usuário não encontrado');
            }

            // Não permitir alterar status do próprio usuário
            if (parseInt(id) === req.session.user.id) {
                return res.redirect('/users?error=Não é possível alterar status do seu próprio usuário');
            }

            // Alternar status
            const newStatus = userData.ativo ? false : true;
            await UserModel.updateStatus(id, newStatus);

            const message = newStatus ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso';
            res.redirect(`/users?success=${message}`);
        } catch (error) {
            console.error('Erro ao alterar status:', error);
            res.redirect('/users?error=Erro interno do servidor');
        }
    }

    // API: Buscar usuários para autocomplete
    static async search(req, res) {
        try {
            const { q } = req.query;

            if (!q || q.length < 2) {
                return res.json({ users: [] });
            }

            const users = await UserModel.search(q, 10);

            res.json({
                success: true,
                users: users.map(user => ({
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    matricula: user.matricula,
                    tipo: user.tipo
                }))
            });
        } catch (error) {
            console.error('Erro na busca de usuários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = UserController;

