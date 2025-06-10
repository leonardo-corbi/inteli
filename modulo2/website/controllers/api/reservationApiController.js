const ReservationModel = require('../../models/reservationModel');
const RoomModel = require('../../models/roomModel');
const UserModel = require('../../models/userModel');
const ReservationLogModel = require('../../models/reservationLogModel');

class ReservationApiController {
    // Listar reservas
    static async index(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const filters = {
                search: req.query.search || '',
                status: req.query.status || '',
                data_inicio: req.query.data_inicio || '',
                data_fim: req.query.data_fim || '',
                sala_id: req.query.sala_id || '',
                usuario_id: req.query.usuario_id || '',
                limit,
                offset
            };

            const reservations = await ReservationModel.findAll(filters);
            const totalReservations = await ReservationModel.count(filters);
            const totalPages = Math.ceil(totalReservations / limit);

            res.json({
                success: true,
                data: reservations,
                pagination: {
                    page,
                    limit,
                    total: totalReservations,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Erro ao listar reservas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar reserva por ID
    static async show(req, res) {
        try {
            const { id } = req.params;
            const reservation = await ReservationModel.findById(id);

            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            res.json({
                success: true,
                data: reservation
            });
        } catch (error) {
            console.error('Erro ao buscar reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Criar reserva
    static async create(req, res) {
        try {
            const { sala_id, usuario_id, data_inicio, data_fim, observacoes } = req.body;

            // Verificar se sala existe
            const room = await RoomModel.findById(sala_id);
            if (!room) {
                return res.status(404).json({
                    success: false,
                    error: 'Sala não encontrada'
                });
            }

            // Verificar se usuário existe
            const user = await UserModel.findById(usuario_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            // Verificar disponibilidade da sala
            const isAvailable = await RoomModel.checkAvailability(sala_id, data_inicio, data_fim);
            if (!isAvailable) {
                return res.status(409).json({
                    success: false,
                    error: 'Sala não está disponível no período selecionado'
                });
            }

            // Criar reserva
            const newReservation = await ReservationModel.create({
                sala_id: parseInt(sala_id),
                usuario_id: parseInt(usuario_id),
                data_inicio,
                data_fim,
                status: 'ativa',
                observacoes: observacoes || ''
            });

            // Registrar log
            await ReservationLogModel.create({
                reserva_id: newReservation.id,
                alterado_por_id: req.user.id,
                descricao: 'Reserva criada via API'
            });

            // Buscar dados completos da reserva criada
            const createdReservation = await ReservationModel.findById(newReservation.id);

            res.status(201).json({
                success: true,
                message: 'Reserva criada com sucesso',
                data: createdReservation
            });
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Atualizar reserva
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { sala_id, usuario_id, data_inicio, data_fim, status, observacoes } = req.body;

            // Verificar se reserva existe
            const existingReservation = await ReservationModel.findById(id);
            if (!existingReservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            // Verificar se sala existe (se fornecida)
            if (sala_id) {
                const room = await RoomModel.findById(sala_id);
                if (!room) {
                    return res.status(404).json({
                        success: false,
                        error: 'Sala não encontrada'
                    });
                }
            }

            // Verificar se usuário existe (se fornecido)
            if (usuario_id) {
                const user = await UserModel.findById(usuario_id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'Usuário não encontrado'
                    });
                }
            }

            // Verificar disponibilidade da sala se status for ativa e datas foram alteradas
            if ((status === 'ativa' || !status) && (sala_id || data_inicio || data_fim)) {
                const roomId = sala_id || existingReservation.sala_id;
                const startDate = data_inicio || existingReservation.data_inicio;
                const endDate = data_fim || existingReservation.data_fim;

                const isAvailable = await RoomModel.checkAvailability(roomId, startDate, endDate, id);
                if (!isAvailable) {
                    return res.status(409).json({
                        success: false,
                        error: 'Sala não está disponível no período selecionado'
                    });
                }
            }

            // Preparar dados para atualização
            const updateData = {};
            if (sala_id) updateData.sala_id = parseInt(sala_id);
            if (usuario_id) updateData.usuario_id = parseInt(usuario_id);
            if (data_inicio) updateData.data_inicio = data_inicio;
            if (data_fim) updateData.data_fim = data_fim;
            if (status) updateData.status = status;
            if (observacoes !== undefined) updateData.observacoes = observacoes;

            // Atualizar reserva
            await ReservationModel.update(id, updateData);

            // Registrar log
            await ReservationLogModel.create({
                reserva_id: id,
                alterado_por_id: req.user.id,
                descricao: `Reserva atualizada via API - Status: ${status || existingReservation.status}`
            });

            // Buscar dados atualizados
            const updatedReservation = await ReservationModel.findById(id);

            res.json({
                success: true,
                message: 'Reserva atualizada com sucesso',
                data: updatedReservation
            });
        } catch (error) {
            console.error('Erro ao atualizar reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Deletar reserva
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(id);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            // Deletar reserva
            await ReservationModel.delete(id);

            res.json({
                success: true,
                message: 'Reserva excluída com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Cancelar reserva
    static async cancel(req, res) {
        try {
            const { id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(id);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            // Verificar se pode ser cancelada
            if (reservation.status === 'cancelada') {
                return res.status(400).json({
                    success: false,
                    error: 'Reserva já está cancelada'
                });
            }

            // Cancelar reserva
            await ReservationModel.updateStatus(id, 'cancelada');

            // Registrar log
            await ReservationLogModel.create({
                reserva_id: id,
                alterado_por_id: req.user.id,
                descricao: 'Reserva cancelada via API'
            });

            // Buscar dados atualizados
            const updatedReservation = await ReservationModel.findById(id);

            res.json({
                success: true,
                message: 'Reserva cancelada com sucesso',
                data: updatedReservation
            });
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Verificar conflitos de horário
    static async checkConflicts(req, res) {
        try {
            const { sala_id, data_inicio, data_fim, reserva_id } = req.query;

            if (!sala_id || !data_inicio || !data_fim) {
                return res.status(400).json({
                    success: false,
                    error: 'Parâmetros obrigatórios: sala_id, data_inicio, data_fim'
                });
            }

            const conflicts = await ReservationModel.findConflicts(
                sala_id,
                data_inicio,
                data_fim,
                reserva_id || null
            );

            res.json({
                success: true,
                data: {
                    hasConflicts: conflicts.length > 0,
                    conflicts: conflicts
                }
            });
        } catch (error) {
            console.error('Erro ao verificar conflitos:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter estatísticas de reservas
    static async stats(req, res) {
        try {
            const stats = await ReservationModel.getStats();

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

    // Obter reservas próximas
    static async upcoming(req, res) {
        try {
            const { limit = 10 } = req.query;
            const reservations = await ReservationModel.findUpcoming(parseInt(limit));

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar reservas próximas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter reservas de hoje
    static async today(req, res) {
        try {
            const reservations = await ReservationModel.findToday();

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar reservas de hoje:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter reservas por período
    static async byPeriod(req, res) {
        try {
            const { data_inicio, data_fim, sala_id, usuario_id, status } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({
                    success: false,
                    error: 'Data de início e fim são obrigatórias'
                });
            }

            const filters = {};
            if (sala_id) filters.sala_id = sala_id;
            if (usuario_id) filters.usuario_id = usuario_id;
            if (status) filters.status = status;

            const reservations = await ReservationModel.findByPeriod(
                data_inicio,
                data_fim,
                filters
            );

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar reservas por período:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter eventos para calendário
    static async calendarEvents(req, res) {
        try {
            const { start, end, sala_id } = req.query;

            const filters = {};
            if (start) filters.data_inicio_min = start;
            if (end) filters.data_fim_max = end;
            if (sala_id) filters.sala_id = sala_id;

            const reservations = await ReservationModel.findAll(filters);

            // Converter para formato do FullCalendar
            const events = reservations.map(reservation => ({
                id: reservation.id,
                title: `${reservation.sala_nome} - ${reservation.usuario_nome}`,
                start: reservation.data_inicio,
                end: reservation.data_fim,
                backgroundColor: reservation.status === 'ativa' ? '#3b82f6' : 
                               reservation.status === 'cancelada' ? '#ef4444' : '#6b7280',
                borderColor: reservation.status === 'ativa' ? '#1d4ed8' : 
                            reservation.status === 'cancelada' ? '#dc2626' : '#4b5563',
                extendedProps: {
                    status: reservation.status,
                    sala_id: reservation.sala_id,
                    usuario_id: reservation.usuario_id,
                    observacoes: reservation.observacoes
                }
            }));

            res.json({
                success: true,
                data: events
            });
        } catch (error) {
            console.error('Erro ao buscar eventos do calendário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs da reserva
    static async logs(req, res) {
        try {
            const { id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(id);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            const logs = await ReservationLogModel.findByReservation(id);

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs da reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter minhas reservas (usuário logado)
    static async myReservations(req, res) {
        try {
            const { status, limit = 10 } = req.query;

            const filters = { limit: parseInt(limit) };
            if (status) filters.status = status;

            const reservations = await ReservationModel.findByUser(req.user.id, filters);

            res.json({
                success: true,
                data: reservations
            });
        } catch (error) {
            console.error('Erro ao buscar minhas reservas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = ReservationApiController;

