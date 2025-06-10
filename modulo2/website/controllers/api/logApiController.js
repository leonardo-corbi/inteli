const ReservationLogModel = require('../../models/reservationLogModel');
const ReservationModel = require('../../models/reservationModel');

class LogApiController {
    // Listar logs
    static async index(req, res) {
        try {
            const { page, limit, offset } = req.pagination;
            const filters = {
                search: req.query.search || '',
                reserva_id: req.query.reserva_id || '',
                alterado_por_id: req.query.alterado_por_id || '',
                data_inicio: req.query.data_inicio || '',
                data_fim: req.query.data_fim || '',
                limit,
                offset
            };

            const logs = await ReservationLogModel.findAll(filters);
            const totalLogs = await ReservationLogModel.count(filters);
            const totalPages = Math.ceil(totalLogs / limit);

            res.json({
                success: true,
                data: logs,
                pagination: {
                    page,
                    limit,
                    total: totalLogs,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        } catch (error) {
            console.error('Erro ao listar logs:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar log por ID
    static async show(req, res) {
        try {
            const { id } = req.params;
            const log = await ReservationLogModel.findById(id);

            if (!log) {
                return res.status(404).json({
                    success: false,
                    error: 'Log não encontrado'
                });
            }

            res.json({
                success: true,
                data: log
            });
        } catch (error) {
            console.error('Erro ao buscar log:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Criar log
    static async create(req, res) {
        try {
            const { reserva_id, descricao } = req.body;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(reserva_id);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            // Criar log
            const newLog = await ReservationLogModel.create({
                reserva_id: parseInt(reserva_id),
                alterado_por_id: req.user.id,
                descricao
            });

            // Buscar dados completos do log criado
            const createdLog = await ReservationLogModel.findById(newLog.id);

            res.status(201).json({
                success: true,
                message: 'Log criado com sucesso',
                data: createdLog
            });
        } catch (error) {
            console.error('Erro ao criar log:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Deletar log
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se log existe
            const log = await ReservationLogModel.findById(id);
            if (!log) {
                return res.status(404).json({
                    success: false,
                    error: 'Log não encontrado'
                });
            }

            // Deletar log
            await ReservationLogModel.delete(id);

            res.json({
                success: true,
                message: 'Log excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao deletar log:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs por reserva
    static async byReservation(req, res) {
        try {
            const { reserva_id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(reserva_id);
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    error: 'Reserva não encontrada'
                });
            }

            const logs = await ReservationLogModel.findByReservation(reserva_id);

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs por reserva:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs por usuário
    static async byUser(req, res) {
        try {
            const { user_id } = req.params;
            const { limit = 10 } = req.query;

            const UserModel = require('../../models/userModel');
            
            // Verificar se usuário existe
            const user = await UserModel.findById(user_id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuário não encontrado'
                });
            }

            const logs = await ReservationLogModel.findByUser(user_id, parseInt(limit));

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs por usuário:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs recentes
    static async recent(req, res) {
        try {
            const { limit = 10 } = req.query;
            const logs = await ReservationLogModel.findRecent(parseInt(limit));

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs recentes:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter estatísticas de logs
    static async stats(req, res) {
        try {
            const stats = await ReservationLogModel.getStats();

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

    // Obter atividade por período
    static async activity(req, res) {
        try {
            const { data_inicio, data_fim, days = 30 } = req.query;

            let startDate, endDate;

            if (data_inicio && data_fim) {
                startDate = data_inicio;
                endDate = data_fim;
            } else {
                // Usar últimos X dias
                endDate = new Date().toISOString();
                startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();
            }

            const activity = await ReservationLogModel.findActivity(startDate, endDate);

            res.json({
                success: true,
                data: {
                    period: {
                        data_inicio: startDate,
                        data_fim: endDate
                    },
                    activity
                }
            });
        } catch (error) {
            console.error('Erro ao buscar atividade:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter logs por período
    static async byPeriod(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({
                    success: false,
                    error: 'Data de início e fim são obrigatórias'
                });
            }

            const logs = await ReservationLogModel.findByPeriod(data_inicio, data_fim);

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar logs por período:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Obter meus logs (usuário logado)
    static async myLogs(req, res) {
        try {
            const { limit = 10 } = req.query;
            const logs = await ReservationLogModel.findByUser(req.user.id, parseInt(limit));

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro ao buscar meus logs:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Buscar logs
    static async search(req, res) {
        try {
            const { q, limit = 10 } = req.query;

            if (!q || q.length < 2) {
                return res.json({
                    success: true,
                    data: []
                });
            }

            const logs = await ReservationLogModel.search(q, parseInt(limit));

            res.json({
                success: true,
                data: logs
            });
        } catch (error) {
            console.error('Erro na busca de logs:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = LogApiController;

