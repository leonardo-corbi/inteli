const UserModel = require('../models/userModel');
const RoomModel = require('../models/roomModel');
const ReservationModel = require('../models/reservationModel');
const ReservationLogModel = require('../models/reservationLogModel');

class HomeController {
    // Dashboard principal
    static async index(req, res) {
        try {
            // Buscar estatísticas do banco
            const [userStats, roomStats, reservationStats, logStats] = await Promise.all([
                UserModel.getStats(),
                RoomModel.getStats(),
                ReservationModel.getStats(),
                ReservationLogModel.getStats()
            ]);

            // Buscar dados recentes
            const [recentReservations, recentUsers, todayReservations, recentLogs] = await Promise.all([
                ReservationModel.findUpcoming(5),
                UserModel.findRecent(5),
                ReservationModel.findToday(),
                ReservationLogModel.findRecent(5)
            ]);

            res.render('pages/dashboard', {
                title: 'Dashboard - Reserva de Salas',
                currentPage: 'dashboard',
                user: req.session.user,
                stats: {
                    users: userStats,
                    rooms: roomStats,
                    reservations: reservationStats,
                    logs: logStats
                },
                recentData: {
                    reservations: recentReservations,
                    users: recentUsers,
                    todayReservations: todayReservations,
                    logs: recentLogs
                }
            });
        } catch (error) {
            console.error('Erro no dashboard:', error);
            res.render('pages/dashboard', {
                title: 'Dashboard - Reserva de Salas',
                currentPage: 'dashboard',
                user: req.session.user,
                stats: {
                    users: { total: 0, ativos: 0, admins: 0 },
                    rooms: { total: 0, capacidade_media: 0 },
                    reservations: { total: 0, ativas: 0, hoje: 0 },
                    logs: { total: 0, hoje: 0 }
                },
                recentData: {
                    reservations: [],
                    users: [],
                    todayReservations: [],
                    logs: []
                },
                error: 'Erro ao carregar dados do dashboard'
            });
        }
    }

    // Página sobre
    static async about(req, res) {
        res.render('pages/about', {
            title: 'Sobre - Reserva de Salas',
            currentPage: 'about',
            user: req.session.user
        });
    }

    // Página de ajuda
    static async help(req, res) {
        res.render('pages/help', {
            title: 'Ajuda - Reserva de Salas',
            currentPage: 'help',
            user: req.session.user
        });
    }
}

module.exports = HomeController;

