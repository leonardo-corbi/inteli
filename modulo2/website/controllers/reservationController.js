const ReservationModel = require('../models/reservationModel');
const RoomModel = require('../models/roomModel');
const UserModel = require('../models/userModel');
const ReservationLogModel = require('../models/reservationLogModel');

class ReservationController {
    // Listar todas as reservas
    static async index(req, res) {
        try {
            const filters = {
                search: req.query.search || '',
                status: req.query.status || '',
                data_inicio: req.query.data_inicio || '',
                data_fim: req.query.data_fim || '',
                sala_id: req.query.sala_id || '',
                usuario_id: req.query.usuario_id || ''
            };

            const reservations = await ReservationModel.findAll(filters);
            const totalReservations = await ReservationModel.count(filters);

            // Buscar salas e usuários para filtros
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();

            res.render('pages/reservations/index', {
                title: 'Reservas - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                reservations: reservations,
                totalReservations: totalReservations,
                rooms: rooms,
                users: users,
                filters: filters,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao listar reservas:', error);
            res.render('pages/reservations/index', {
                title: 'Reservas - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                reservations: [],
                totalReservations: 0,
                rooms: [],
                users: [],
                filters: {},
                error: 'Erro ao carregar reservas'
            });
        }
    }

    // Página de criação de reserva
    static async createPage(req, res) {
        try {
            // Buscar salas e usuários para os selects
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();

            res.render('pages/reservations/create', {
                title: 'Nova Reserva - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                rooms: rooms,
                users: users,
                formData: {},
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao carregar página de criação:', error);
            res.render('pages/reservations/create', {
                title: 'Nova Reserva - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                rooms: [],
                users: [],
                formData: {},
                error: 'Erro ao carregar dados'
            });
        }
    }

    // Criar nova reserva
    static async create(req, res) {
        try {
            const { sala_id, usuario_id, data_inicio, data_fim, observacoes } = req.body;

            // Buscar dados para recarregar a página em caso de erro
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();

            // Validações
            if (!sala_id || !usuario_id || !data_inicio || !data_fim) {
                return res.render('pages/reservations/create', {
                    title: 'Nova Reserva - Reserva de Salas',
                    currentPage: 'reservations',
                    user: req.session.user,
                    rooms: rooms,
                    users: users,
                    formData: req.body,
                    error: 'Sala, usuário, data de início e fim são obrigatórios'
                });
            }

            // Validar datas
            const startDate = new Date(data_inicio);
            const endDate = new Date(data_fim);
            const now = new Date();

            if (startDate < now) {
                return res.render('pages/reservations/create', {
                    title: 'Nova Reserva - Reserva de Salas',
                    currentPage: 'reservations',
                    user: req.session.user,
                    rooms: rooms,
                    users: users,
                    formData: req.body,
                    error: 'Data de início não pode ser no passado'
                });
            }

            if (endDate <= startDate) {
                return res.render('pages/reservations/create', {
                    title: 'Nova Reserva - Reserva de Salas',
                    currentPage: 'reservations',
                    user: req.session.user,
                    rooms: rooms,
                    users: users,
                    formData: req.body,
                    error: 'Data de fim deve ser posterior à data de início'
                });
            }

            // Verificar disponibilidade da sala
            const isAvailable = await RoomModel.checkAvailability(sala_id, data_inicio, data_fim);
            if (!isAvailable) {
                return res.render('pages/reservations/create', {
                    title: 'Nova Reserva - Reserva de Salas',
                    currentPage: 'reservations',
                    user: req.session.user,
                    rooms: rooms,
                    users: users,
                    formData: req.body,
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
                alterado_por_id: req.session.user.id,
                descricao: 'Reserva criada'
            });

            res.redirect('/reservations?success=Reserva criada com sucesso');
        } catch (error) {
            console.error('Erro ao criar reserva:', error);
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();
            res.render('pages/reservations/create', {
                title: 'Nova Reserva - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                rooms: rooms,
                users: users,
                formData: req.body,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Página de edição de reserva
    static async editPage(req, res) {
        try {
            const { id } = req.params;
            const reservation = await ReservationModel.findById(id);

            if (!reservation) {
                return res.redirect('/reservations?error=Reserva não encontrada');
            }

            // Buscar salas e usuários para os selects
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();

            res.render('pages/reservations/edit', {
                title: 'Editar Reserva - Reserva de Salas',
                currentPage: 'reservations',
                user: req.session.user,
                reservation: reservation,
                rooms: rooms,
                users: users,
                formData: reservation,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao buscar reserva:', error);
            res.redirect('/reservations?error=Erro ao carregar reserva');
        }
    }

    // Atualizar reserva
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { sala_id, usuario_id, data_inicio, data_fim, status, observacoes } = req.body;

            // Buscar reserva atual
            const currentReservation = await ReservationModel.findById(id);
            if (!currentReservation) {
                return res.redirect('/reservations?error=Reserva não encontrada');
            }

            // Buscar dados para recarregar a página em caso de erro
            const rooms = await RoomModel.findAll();
            const users = await UserModel.findAll();

            // Validações
            if (!sala_id || !usuario_id || !data_inicio || !data_fim || !status) {
                return res.render('pages/reservations/edit', {
                    title: 'Editar Reserva - Reserva de Salas',
                    currentPage: 'reservations',
                    user: req.session.user,
                    reservation: currentReservation,
                    rooms: rooms,
                    users: users,
                    formData: req.body,
                    error: 'Todos os campos são obrigatórios'
                });
            }

            // Validar datas se status for ativa
            if (status === 'ativa') {
                const startDate = new Date(data_inicio);
                const endDate = new Date(data_fim);

                if (endDate <= startDate) {
                    return res.render('pages/reservations/edit', {
                        title: 'Editar Reserva - Reserva de Salas',
                        currentPage: 'reservations',
                        user: req.session.user,
                        reservation: currentReservation,
                        rooms: rooms,
                        users: users,
                        formData: req.body,
                        error: 'Data de fim deve ser posterior à data de início'
                    });
                }

                // Verificar disponibilidade da sala (excluindo a própria reserva)
                const isAvailable = await RoomModel.checkAvailability(sala_id, data_inicio, data_fim, id);
                if (!isAvailable) {
                    return res.render('pages/reservations/edit', {
                        title: 'Editar Reserva - Reserva de Salas',
                        currentPage: 'reservations',
                        user: req.session.user,
                        reservation: currentReservation,
                        rooms: rooms,
                        users: users,
                        formData: req.body,
                        error: 'Sala não está disponível no período selecionado'
                    });
                }
            }

            // Atualizar reserva
            await ReservationModel.update(id, {
                sala_id: parseInt(sala_id),
                usuario_id: parseInt(usuario_id),
                data_inicio,
                data_fim,
                status,
                observacoes: observacoes || ''
            });

            // Registrar log
            await ReservationLogModel.create({
                reserva_id: id,
                alterado_por_id: req.session.user.id,
                descricao: `Reserva atualizada - Status: ${status}`
            });

            res.redirect('/reservations?success=Reserva atualizada com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar reserva:', error);
            res.redirect(`/reservations/${req.params.id}/edit?error=Erro interno do servidor`);
        }
    }

    // Visualizar detalhes da reserva
    static async show(req, res) {
        try {
            const { id } = req.params;
            const reservation = await ReservationModel.findById(id);

            if (!reservation) {
                return res.redirect('/reservations?error=Reserva não encontrada');
            }

            // Buscar logs da reserva
            const reservationLogs = await ReservationLogModel.findByReservation(id);

            res.render('pages/reservations/show', {
                title: `Reserva #${reservation.id} - Reserva de Salas`,
                currentPage: 'reservations',
                user: req.session.user,
                reservation: reservation,
                logs: reservationLogs
            });
        } catch (error) {
            console.error('Erro ao visualizar reserva:', error);
            res.redirect('/reservations?error=Erro ao carregar reserva');
        }
    }

    // Cancelar reserva
    static async cancel(req, res) {
        try {
            const { id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(id);
            if (!reservation) {
                return res.redirect('/reservations?error=Reserva não encontrada');
            }

            // Verificar se pode ser cancelada
            if (reservation.status === 'cancelada') {
                return res.redirect('/reservations?error=Reserva já está cancelada');
            }

            // Cancelar reserva
            await ReservationModel.updateStatus(id, 'cancelada');

            // Registrar log
            await ReservationLogModel.create({
                reserva_id: id,
                alterado_por_id: req.session.user.id,
                descricao: 'Reserva cancelada'
            });

            res.redirect('/reservations?success=Reserva cancelada com sucesso');
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            res.redirect('/reservations?error=Erro interno do servidor');
        }
    }

    // Deletar reserva
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se reserva existe
            const reservation = await ReservationModel.findById(id);
            if (!reservation) {
                return res.redirect('/reservations?error=Reserva não encontrada');
            }

            // Deletar reserva (isso também deletará os logs relacionados)
            await ReservationModel.delete(id);

            res.redirect('/reservations?success=Reserva excluída com sucesso');
        } catch (error) {
            console.error('Erro ao deletar reserva:', error);
            res.redirect('/reservations?error=Erro interno do servidor');
        }
    }

    // API: Verificar conflitos de horário
    static async checkConflicts(req, res) {
        try {
            const { sala_id, data_inicio, data_fim, reserva_id } = req.query;

            if (!sala_id || !data_inicio || !data_fim) {
                return res.status(400).json({ error: 'Parâmetros obrigatórios: sala_id, data_inicio, data_fim' });
            }

            const conflicts = await ReservationModel.findConflicts(
                sala_id,
                data_inicio,
                data_fim,
                reserva_id || null
            );

            res.json({
                success: true,
                hasConflicts: conflicts.length > 0,
                conflicts: conflicts
            });
        } catch (error) {
            console.error('Erro ao verificar conflitos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Página do calendário
    static async calendar(req, res) {
        try {
            // Buscar todas as salas para filtro
            const rooms = await RoomModel.findAll();

            res.render('pages/reservations/calendar', {
                title: 'Calendário - Reserva de Salas',
                currentPage: 'calendar',
                user: req.session.user,
                rooms: rooms
            });
        } catch (error) {
            console.error('Erro ao carregar calendário:', error);
            res.render('pages/reservations/calendar', {
                title: 'Calendário - Reserva de Salas',
                currentPage: 'calendar',
                user: req.session.user,
                rooms: [],
                error: 'Erro ao carregar calendário'
            });
        }
    }

    // API: Buscar eventos para o calendário
    static async getCalendarEvents(req, res) {
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

            res.json(events);
        } catch (error) {
            console.error('Erro ao buscar eventos do calendário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = ReservationController;

