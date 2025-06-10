const UserModel = require('../../models/userModel');
const bcrypt = require('bcrypt');

class UserApiController {
    // Listar usuários
    static async index(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const filters = {
                search: req.query.search || '',
                tipo: req.query.tipo || '',
                ativo: req.query.ativo || '',
                limit,
                offset
            };

            const users = await UserModel.findAll(filters);
            const totalUsers = await UserModel.count(filters);
            const totalPages = Math.ceil(totalUsers / limit);

            // Remover senhas da resposta
            const usersResponse = users.map(user => {
                const { senha, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.json({
                success: true,
                data: usersResponse,
                pagination: {
                    page,
                    limit,
                    total: totalUsers,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar usuário por ID
    static async show(req, res) {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            // Remover senha da resposta
            const { senha, ...userResponse } = user;

            res.json({
                success: true,
                data: userResponse
            });
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Criar usuário
    static async create(req, res) {
        try {
            const { nome, email, matricula, tipo, senha } = req.body;

            // Verificar se email já existe
            const existingEmail = await UserModel.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    error: 'Email já está em uso'
                });
            }

            // Verificar se matrícula já existe
            const existingMatricula = await UserModel.findByMatricula(matricula);
            if (existingMatricula) {
                return res.status(409).json({
                    success: false,
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
                tipo: tipo || 'usuario',
                senha: hashedPassword
            });

            // Remover senha da resposta
            const { senha: _, ...userResponse } = newUser;

            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: userResponse
            });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar usuário
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, matricula, tipo, senha, ativo } = req.body;

            // Verificar se usuário existe
            const existingUser = await UserModel.findById(id);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            // Verificar se email já existe (exceto o próprio usuário)
            if (email) {
                const emailExists = await UserModel.emailExists(email, id);
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Email já está em uso'
                    });
                }
            }

            // Verificar se matrícula já existe (exceto o próprio usuário)
            if (matricula) {
                const matriculaExists = await UserModel.matriculaExists(matricula, id);
                if (matriculaExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Matrícula já está em uso'
                    });
                }
            }

            // Preparar dados para atualização
            const updateData = {};
            if (nome) updateData.nome = nome;
            if (email) updateData.email = email;
            if (matricula) updateData.matricula = matricula;
            if (tipo) updateData.tipo = tipo;
            if (typeof ativo === 'boolean') updateData.ativo = ativo;

            // Se senha foi fornecida, criptografar
            if (senha) {
                updateData.senha = await bcrypt.hash(senha, 10);
            }

            // Atualizar usuário
            await UserModel.update(id, updateData);

            // Buscar dados atualizados
            const updatedUser = await UserModel.findById(id);
            const { senha: _, ...userResponse } = updatedUser;

            res.json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: userResponse
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Deletar usuário
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se usuário existe
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            // Não permitir deletar o próprio usuário
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Não é possível excluir seu próprio usuário'
                });
            }

            // Verificar se há reservas ativas
            const ReservationModel = require('../../models/reservationModel');
            const activeReservations = await ReservationModel.findByUser(id, { status: 'ativa' });
            if (activeReservations.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Não é possível excluir usuário com reservas ativas'
                });
            }

            // Deletar usuário
            await UserModel.delete(id);

            res.json({
                success: true,
                message: 'Usuário excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Alterar status do usuário
    static async toggleStatus(req, res) {
        try {
            const { id } = req.params;
            const { ativo } = req.body;

            // Verificar se usuário existe
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            // Não permitir alterar status do próprio usuário
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Não é possível alterar status do seu próprio usuário'
                });
            }

            // Alterar status
            const newStatus = typeof ativo === 'boolean' ? ativo : !user.ativo;
            await UserModel.updateStatus(id, newStatus);

            // Buscar dados atualizados
            const updatedUser = await UserModel.findById(id);
            const { senha: _, ...userResponse } = updatedUser;

            res.json({
                success: true,
                message: `Usuário ${newStatus ? 'ativado' : 'desativado'} com sucesso`,
                data: userResponse
            });
        } catch (error) {
            console.error('Erro ao alterar status:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar usuários (autocomplete)
    static async search(req, res) {
        try {
            const { q, limit = 10 } = req.query;

            if (!q || q.length < 2) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            const users = await UserModel.search(q, parseInt(limit));

            // Remover senhas da resposta
            const usersResponse = users.map(user => {
                const { senha, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.json({
                success: true,
                data: usersResponse
            });
        } catch (error) {
            console.error('Erro na busca de usuários:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter estatísticas de usuários
    static async stats(req, res) {
        try {
            const stats = await UserModel.getStats();

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter usuários recentes
    static async recent(req, res) {
        try {
            const { limit = 5 } = req.query;
            const users = await UserModel.findRecent(parseInt(limit));

            // Remover senhas da resposta
            const usersResponse = users.map(user => {
                const { senha, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.json({
                success: true,
                data: usersResponse
            });
        } catch (error) {
            console.error('Erro ao buscar usuários recentes:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter reservas do usuário
    static async reservations(req, res) {
        try {
            const { id } = req.params;
            const { status, limit = 10 } = req.query;

            // Verificar se usuário existe
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            const ReservationModel = require('../../models/reservationModel');
            const filters = { limit: parseInt(limit) };
            if (status) filters.status = status;

            const reservations = await ReservationModel.findByUser(id, filters);

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar reservas do usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs do usuário
    static async logs(req, res) {
        try {
            const { id } = req.params;
            const { limit = 10 } = req.query;

            // Verificar se usuário existe
            const user = await UserModel.findById(id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            const ReservationLogModel = require('../../models/reservationLogModel');
            const logs = await ReservationLogModel.findByUser(id, parseInt(limit));

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs do usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = UserApiController;

