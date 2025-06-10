const RoomModel = require('../../models/roomModel');

class RoomApiController {
    // Listar salas
    static async index(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const filters = {
                search: req.query.search || '',
                capacidade_min: req.query.capacidade_min || '',
                capacidade_max: req.query.capacidade_max || '',
                localizacao: req.query.localizacao || '',
                limit,
                offset
            };

            const rooms = await RoomModel.findAll(filters);
            const totalRooms = await RoomModel.count(filters);
            const totalPages = Math.ceil(totalRooms / limit);

            res.json({
                success: true,
                data: rooms,
                pagination: {
                    page,
                    limit,
                    total: totalRooms,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Erro ao listar salas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar sala por ID
    static async show(req, res) {
        try {
            const { id } = req.params;
            const room = await RoomModel.findById(id);

            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            res.json({
                success: true,
                data: room
            });
        } catch (error) {
            console.error('Erro ao buscar sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Criar sala
    static async create(req, res) {
        try {
            const { nome, localizacao, capacidade, recursos } = req.body;

            // Verificar se nome já existe
            const existingRoom = await RoomModel.findByName(nome);
            if (existingRoom) {
                return res.status(409).json({
                    success: false,
                    error: 'Já existe uma sala com este nome'
                });
            }

            // Criar sala
            const newRoom = await RoomModel.create({
                nome,
                localizacao,
                capacidade: parseInt(capacidade),
                recursos: recursos || ''
            });

            res.status(201).json({
                success: true,
                message: 'Sala criada com sucesso',
                data: newRoom
            });
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar sala
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, localizacao, capacidade, recursos } = req.body;

            // Verificar se sala existe
            const existingRoom = await RoomModel.findById(id);
            if (!existingRoom) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            // Verificar se nome já existe (exceto a própria sala)
            if (nome) {
                const nameExists = await RoomModel.nameExists(nome, id);
                if (nameExists) {
                    return res.status(409).json({
                        success: false,
                        error: 'Já existe uma sala com este nome'
                    });
                }
            }

            // Preparar dados para atualização
            const updateData = {};
            if (nome) updateData.nome = nome;
            if (localizacao) updateData.localizacao = localizacao;
            if (capacidade) updateData.capacidade = parseInt(capacidade);
            if (recursos !== undefined) updateData.recursos = recursos;

            // Atualizar sala
            await RoomModel.update(id, updateData);

            // Buscar dados atualizados
            const updatedRoom = await RoomModel.findById(id);

            res.json({
                success: true,
                message: 'Sala atualizada com sucesso',
                data: updatedRoom
            });
        } catch (error) {
            console.error('Erro ao atualizar sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Deletar sala
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se sala existe
            const room = await RoomModel.findById(id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            // Verificar se há reservas ativas
            const ReservationModel = require('../../models/reservationModel');
            const activeReservations = await ReservationModel.findByRoom(id, { status: 'ativa' });
            if (activeReservations.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Não é possível excluir sala com reservas ativas'
                });
            }

            // Deletar sala
            await RoomModel.delete(id);

            res.json({
                success: true,
                message: 'Sala excluída com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar salas disponíveis
    static async available(req, res) {
        try {
            const { data_inicio, data_fim, capacidade_min } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({
                    success: false,
                    error: 'Data de início e fim são obrigatórias'
                });
            }

            const filters = { data_inicio, data_fim };
            if (capacidade_min) filters.capacidade_min = parseInt(capacidade_min);

            const availableRooms = await RoomModel.findAvailable(filters);

            res.json({
                success: true,
                data: availableRooms
            });
        } catch (error) {
            console.error('Erro ao buscar salas disponíveis:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Verificar disponibilidade de uma sala
    static async checkAvailability(req, res) {
        try {
            const { id } = req.params;
            const { data_inicio, data_fim, reserva_id } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({
                    success: false,
                    error: 'Data de início e fim são obrigatórias'
                });
            }

            // Verificar se sala existe
            const room = await RoomModel.findById(id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            const isAvailable = await RoomModel.checkAvailability(
                id, 
                data_inicio, 
                data_fim, 
                reserva_id || null
            );

            res.json({
                success: true,
                data: {
                    room_id: parseInt(id),
                    available: isAvailable,
                    period: {
                        data_inicio,
                        data_fim
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter estatísticas de salas
    static async stats(req, res) {
        try {
            const stats = await RoomModel.getStats();

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

    // Obter salas mais utilizadas
    static async mostUsed(req, res) {
        try {
            const { limit = 10 } = req.query;
            const rooms = await RoomModel.findMostUsed(parseInt(limit));

            res.json({
                success: true,
                data: rooms
            });
        } catch (error) {
            console.error('Erro ao buscar salas mais utilizadas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter reservas da sala
    static async reservations(req, res) {
        try {
            const { id } = req.params;
            const { status, limit = 10, data_inicio, data_fim } = req.query;

            // Verificar se sala existe
            const room = await RoomModel.findById(id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            const ReservationModel = require('../../models/reservationModel');
            const filters = { limit: parseInt(limit) };
            if (status) filters.status = status;
            if (data_inicio) filters.data_inicio = data_inicio;
            if (data_fim) filters.data_fim = data_fim;

            const reservations = await ReservationModel.findByRoom(id, filters);

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar reservas da sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar salas (autocomplete)
    static async search(req, res) {
        try {
            const { q, limit = 10 } = req.query;

            if (!q || q.length < 2) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            const rooms = await RoomModel.search(q, parseInt(limit));

            res.json({
                success: true,
                data: rooms
            });
        } catch (error) {
            console.error('Erro na busca de salas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter agenda da sala (reservas por período)
    static async schedule(req, res) {
        try {
            const { id } = req.params;
            const { data_inicio, data_fim } = req.query;

            // Verificar se sala existe
            const room = await RoomModel.findById(id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            // Se não forneceu datas, usar próximos 7 dias
            const startDate = data_inicio || new Date().toISOString().split('T')[0];
            const endDate = data_fim || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            const ReservationModel = require('../../models/reservationModel');
            const reservations = await ReservationModel.findByPeriod(
                startDate + ' 00:00:00',
                endDate + ' 23:59:59',
                { sala_id: id }
            );

            res.json({
                success: true,
                data: {
                    room,
                    period: {
                        data_inicio: startDate,
                        data_fim: endDate
                    },
                    reservations
                }
            });
        } catch (error) {
            console.error('Erro ao buscar agenda da sala:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = RoomApiController;

