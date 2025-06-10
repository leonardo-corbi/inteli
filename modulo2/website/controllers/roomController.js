const RoomModel = require('../models/roomModel');

class RoomController {
    // Listar todas as salas
    static async index(req, res) {
        try {
            const filters = {
                search: req.query.search || '',
                capacidade_min: req.query.capacidade_min || '',
                capacidade_max: req.query.capacidade_max || ''
            };

            const rooms = await RoomModel.findAll(filters);
            const totalRooms = await RoomModel.count(filters);

            res.render('pages/rooms/index', {
                title: 'Salas - Reserva de Salas',
                currentPage: 'rooms',
                user: req.session.user,
                rooms: rooms,
                totalRooms: totalRooms,
                filters: filters,
                success: req.query.success || null,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao listar salas:', error);
            res.render('pages/rooms/index', {
                title: 'Salas - Reserva de Salas',
                currentPage: 'rooms',
                user: req.session.user,
                rooms: [],
                totalRooms: 0,
                filters: {},
                error: 'Erro ao carregar salas'
            });
        }
    }

    // Página de criação de sala
    static async createPage(req, res) {
        res.render('pages/rooms/create', {
            title: 'Nova Sala - Reserva de Salas',
            currentPage: 'rooms',
            user: req.session.user,
            formData: {},
            error: req.query.error || null
        });
    }

    // Criar nova sala
    static async create(req, res) {
        try {
            const { nome, localizacao, capacidade, recursos } = req.body;

            // Validações
            if (!nome || !localizacao || !capacidade) {
                return res.render('pages/rooms/create', {
                    title: 'Nova Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Nome, localização e capacidade são obrigatórios'
                });
            }

            if (isNaN(capacidade) || parseInt(capacidade) <= 0) {
                return res.render('pages/rooms/create', {
                    title: 'Nova Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    formData: req.body,
                    error: 'Capacidade deve ser um número maior que zero'
                });
            }

            // Verificar se nome já existe
            const existingRoom = await RoomModel.findByName(nome);
            if (existingRoom) {
                return res.render('pages/rooms/create', {
                    title: 'Nova Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    formData: req.body,
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

            res.redirect('/rooms?success=Sala criada com sucesso');
        } catch (error) {
            console.error('Erro ao criar sala:', error);
            res.render('pages/rooms/create', {
                title: 'Nova Sala - Reserva de Salas',
                currentPage: 'rooms',
                user: req.session.user,
                formData: req.body,
                error: 'Erro interno do servidor'
            });
        }
    }

    // Página de edição de sala
    static async editPage(req, res) {
        try {
            const { id } = req.params;
            const room = await RoomModel.findById(id);

            if (!room) {
                return res.redirect('/rooms?error=Sala não encontrada');
            }

            res.render('pages/rooms/edit', {
                title: 'Editar Sala - Reserva de Salas',
                currentPage: 'rooms',
                user: req.session.user,
                room: room,
                formData: room,
                error: req.query.error || null
            });
        } catch (error) {
            console.error('Erro ao buscar sala:', error);
            res.redirect('/rooms?error=Erro ao carregar sala');
        }
    }

    // Atualizar sala
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, localizacao, capacidade, recursos } = req.body;

            // Buscar sala atual
            const currentRoom = await RoomModel.findById(id);
            if (!currentRoom) {
                return res.redirect('/rooms?error=Sala não encontrada');
            }

            // Validações
            if (!nome || !localizacao || !capacidade) {
                return res.render('pages/rooms/edit', {
                    title: 'Editar Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    room: currentRoom,
                    formData: req.body,
                    error: 'Nome, localização e capacidade são obrigatórios'
                });
            }

            if (isNaN(capacidade) || parseInt(capacidade) <= 0) {
                return res.render('pages/rooms/edit', {
                    title: 'Editar Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    room: currentRoom,
                    formData: req.body,
                    error: 'Capacidade deve ser um número maior que zero'
                });
            }

            // Verificar se nome já existe (exceto a própria sala)
            const nameExists = await RoomModel.nameExists(nome, id);
            if (nameExists) {
                return res.render('pages/rooms/edit', {
                    title: 'Editar Sala - Reserva de Salas',
                    currentPage: 'rooms',
                    user: req.session.user,
                    room: currentRoom,
                    formData: req.body,
                    error: 'Já existe uma sala com este nome'
                });
            }

            // Atualizar sala
            await RoomModel.update(id, {
                nome,
                localizacao,
                capacidade: parseInt(capacidade),
                recursos: recursos || ''
            });

            res.redirect('/rooms?success=Sala atualizada com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar sala:', error);
            res.redirect(`/rooms/${req.params.id}/edit?error=Erro interno do servidor`);
        }
    }

    // Visualizar detalhes da sala
    static async show(req, res) {
        try {
            const { id } = req.params;
            const room = await RoomModel.findById(id);

            if (!room) {
                return res.redirect('/rooms?error=Sala não encontrada');
            }

            // Buscar reservas da sala (próximas 10)
            const roomReservations = await ReservationModel.findByRoom(id, { 
                status: 'ativa',
                data_inicio: new Date().toISOString()
            });

            res.render('pages/rooms/show', {
                title: `${room.nome} - Reserva de Salas`,
                currentPage: 'rooms',
                user: req.session.user,
                room: room,
                reservations: roomReservations
            });
        } catch (error) {
            console.error('Erro ao visualizar sala:', error);
            res.redirect('/rooms?error=Erro ao carregar sala');
        }
    }

    // Deletar sala
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar se sala existe
            const room = await RoomModel.findById(id);
            if (!room) {
                return res.redirect('/rooms?error=Sala não encontrada');
            }

            // Verificar se há reservas ativas
            const activeReservations = await ReservationModel.findByRoom(id, { status: 'ativa' });
            if (activeReservations.length > 0) {
                return res.redirect('/rooms?error=Não é possível excluir sala com reservas ativas');
            }

            // Deletar sala
            await RoomModel.delete(id);

            res.redirect('/rooms?success=Sala excluída com sucesso');
        } catch (error) {
            console.error('Erro ao deletar sala:', error);
            res.redirect('/rooms?error=Erro interno do servidor');
        }
    }

    // API: Buscar salas disponíveis
    static async getAvailable(req, res) {
        try {
            const { data_inicio, data_fim } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({ error: 'Data de início e fim são obrigatórias' });
            }

            const availableRooms = await RoomModel.findAvailable(data_inicio, data_fim);

            res.json({
                success: true,
                rooms: availableRooms
            });
        } catch (error) {
            console.error('Erro ao buscar salas disponíveis:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // API: Verificar disponibilidade de uma sala
    static async checkAvailability(req, res) {
        try {
            const { id } = req.params;
            const { data_inicio, data_fim, reserva_id } = req.query;

            if (!data_inicio || !data_fim) {
                return res.status(400).json({ error: 'Data de início e fim são obrigatórias' });
            }

            const isAvailable = await RoomModel.checkAvailability(
                id, 
                data_inicio, 
                data_fim, 
                reserva_id || null
            );

            res.json({
                success: true,
                available: isAvailable
            });
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = RoomController;

