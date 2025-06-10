const ReservationLogModel = require('../models/reservationLogModel');

class LogController {
    // Listar todos os logs
    static async index(req, res) {
        try {
            const logs = await ReservationLogModel.findAll();
            res.render('pages/logs/index', { 
                title: 'Logs de Reservas - Reserva de Salas',
                logs,
                currentPage: 'logs'
            });
        } catch (error) {
            console.error('Erro ao listar logs:', error);
            res.status(500).render('pages/error', { 
                title: 'Erro - Reserva de Salas',
                message: 'Erro interno do servidor',
                error: error.message 
            });
        }
    }

    // Exibir detalhes do log
    static async show(req, res) {
        try {
            const { id } = req.params;
            const log = await ReservationLogModel.findById(id);
            
            if (!log) {
                return res.status(404).render('pages/error', {
                    title: 'Log não encontrado - Reserva de Salas',
                    message: 'Log não encontrado'
                });
            }
            
            res.render('pages/logs/show', { 
                title: `Log #${log.id} - Reserva de Salas`,
                log,
                currentPage: 'logs'
            });
        } catch (error) {
            console.error('Erro ao exibir log:', error);
            res.status(500).render('pages/error', { 
                title: 'Erro - Reserva de Salas',
                message: 'Erro interno do servidor',
                error: error.message 
            });
        }
    }

    // Logs por reserva
    static async byReservation(req, res) {
        try {
            const { reservationId } = req.params;
            const logs = await ReservationLogModel.findByReservation(reservationId);
            
            res.render('pages/logs/by-reservation', { 
                title: `Logs da Reserva #${reservationId} - Reserva de Salas`,
                logs,
                reservationId,
                currentPage: 'logs'
            });
        } catch (error) {
            console.error('Erro ao listar logs por reserva:', error);
            res.status(500).render('pages/error', { 
                title: 'Erro - Reserva de Salas',
                message: 'Erro interno do servidor',
                error: error.message 
            });
        }
    }

    // Logs por usuário
    static async byUser(req, res) {
        try {
            const { userId } = req.params;
            const logs = await ReservationLogModel.findByUser(userId);
            
            res.render('pages/logs/by-user', { 
                title: `Logs do Usuário #${userId} - Reserva de Salas`,
                logs,
                userId,
                currentPage: 'logs'
            });
        } catch (error) {
            console.error('Erro ao listar logs por usuário:', error);
            res.status(500).render('pages/error', { 
                title: 'Erro - Reserva de Salas',
                message: 'Erro interno do servidor',
                error: error.message 
            });
        }
    }

    // Relatório de logs por período
    static async report(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;
            
            let logs = [];
            if (data_inicio && data_fim) {
                logs = await ReservationLogModel.findByDateRange(data_inicio, data_fim);
            } else {
                logs = await ReservationLogModel.findAll();
            }
            
            res.render('pages/logs/report', { 
                title: 'Relatório de Logs - Reserva de Salas',
                logs,
                filters: { data_inicio, data_fim },
                currentPage: 'logs'
            });
        } catch (error) {
            console.error('Erro ao gerar relatório de logs:', error);
            res.status(500).render('pages/error', { 
                title: 'Erro - Reserva de Salas',
                message: 'Erro interno do servidor',
                error: error.message 
            });
        }
    }

    // API endpoints
    static async apiIndex(req, res) {
        try {
            const logs = await ReservationLogModel.findAll();
            res.json(logs);
        } catch (error) {
            console.error('Erro ao listar logs via API:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async apiShow(req, res) {
        try {
            const { id } = req.params;
            const log = await ReservationLogModel.findById(id);
            
            if (!log) {
                return res.status(404).json({ error: 'Log não encontrado' });
            }

            res.json(log);
        } catch (error) {
            console.error('Erro ao exibir log via API:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    static async apiByReservation(req, res) {
        try {
            const { reservationId } = req.params;
            const logs = await ReservationLogModel.findByReservation(reservationId);
            res.json(logs);
        } catch (error) {
            console.error('Erro ao listar logs por reserva via API:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = LogController;

