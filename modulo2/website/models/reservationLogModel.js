const { query } = require('../config/db');

class ReservationLogModel {
    // Criar novo log
    static async create(logData) {
        const { reserva_id, alterado_por_id, descricao, data_alteracao = new Date() } = logData;
        
        const sql = `
            INSERT INTO reservation_logs (reserva_id, alterado_por_id, descricao, data_alteracao, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;
        
        const result = await query(sql, [reserva_id, alterado_por_id, descricao, data_alteracao]);
        return result.rows[0];
    }

    // Buscar log por ID
    static async findById(id) {
        const sql = `
            SELECT 
                rl.*,
                r.id as reserva_id,
                s.nome as sala_nome,
                u.nome as usuario_nome,
                u_alt.nome as alterado_por_nome
            FROM reservation_logs rl
            JOIN reservations r ON rl.reserva_id = r.id
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            JOIN users u_alt ON rl.alterado_por_id = u_alt.id
            WHERE rl.id = $1
        `;
        
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Listar todos os logs
    static async findAll(filters = {}) {
        let sql = `
            SELECT 
                rl.*,
                r.id as reserva_id,
                s.nome as sala_nome,
                u.nome as usuario_nome,
                u_alt.nome as alterado_por_nome
            FROM reservation_logs rl
            JOIN reservations r ON rl.reserva_id = r.id
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            JOIN users u_alt ON rl.alterado_por_id = u_alt.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 0;

        if (filters.reserva_id) {
            paramCount++;
            sql += ` AND rl.reserva_id = $${paramCount}`;
            params.push(parseInt(filters.reserva_id));
        }

        if (filters.alterado_por_id) {
            paramCount++;
            sql += ` AND rl.alterado_por_id = $${paramCount}`;
            params.push(parseInt(filters.alterado_por_id));
        }

        if (filters.data_inicio) {
            paramCount++;
            sql += ` AND rl.data_alteracao >= $${paramCount}`;
            params.push(filters.data_inicio);
        }

        if (filters.data_fim) {
            paramCount++;
            sql += ` AND rl.data_alteracao <= $${paramCount}`;
            params.push(filters.data_fim);
        }

        if (filters.search) {
            paramCount++;
            sql += ` AND (rl.descricao ILIKE $${paramCount} OR s.nome ILIKE $${paramCount} OR u.nome ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
        }

        sql += ' ORDER BY rl.data_alteracao DESC';

        if (filters.limit) {
            paramCount++;
            sql += ` LIMIT $${paramCount}`;
            params.push(parseInt(filters.limit));
        }

        const result = await query(sql, params);
        return result.rows;
    }

    // Buscar logs por reserva
    static async findByReservation(reservaId) {
        const sql = `
            SELECT 
                rl.*,
                u.nome as alterado_por_nome,
                u.email as alterado_por_email
            FROM reservation_logs rl
            JOIN users u ON rl.alterado_por_id = u.id
            WHERE rl.reserva_id = $1
            ORDER BY rl.data_alteracao DESC
        `;
        
        const result = await query(sql, [reservaId]);
        return result.rows;
    }

    // Buscar logs por usuário que fez alteração
    static async findByUser(userId, limit = 50) {
        const sql = `
            SELECT 
                rl.*,
                r.id as reserva_id,
                s.nome as sala_nome,
                u.nome as usuario_nome
            FROM reservation_logs rl
            JOIN reservations r ON rl.reserva_id = r.id
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE rl.alterado_por_id = $1
            ORDER BY rl.data_alteracao DESC
            LIMIT $2
        `;
        
        const result = await query(sql, [userId, limit]);
        return result.rows;
    }

    // Buscar logs recentes
    static async findRecent(limit = 20) {
        const sql = `
            SELECT 
                rl.*,
                r.id as reserva_id,
                s.nome as sala_nome,
                u.nome as usuario_nome,
                u_alt.nome as alterado_por_nome
            FROM reservation_logs rl
            JOIN reservations r ON rl.reserva_id = r.id
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            JOIN users u_alt ON rl.alterado_por_id = u_alt.id
            ORDER BY rl.data_alteracao DESC
            LIMIT $1
        `;
        
        const result = await query(sql, [limit]);
        return result.rows;
    }

    // Buscar logs do dia
    static async findToday() {
        const sql = `
            SELECT 
                rl.*,
                r.id as reserva_id,
                s.nome as sala_nome,
                u.nome as usuario_nome,
                u_alt.nome as alterado_por_nome
            FROM reservation_logs rl
            JOIN reservations r ON rl.reserva_id = r.id
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            JOIN users u_alt ON rl.alterado_por_id = u_alt.id
            WHERE DATE(rl.data_alteracao) = CURRENT_DATE
            ORDER BY rl.data_alteracao DESC
        `;
        
        const result = await query(sql);
        return result.rows;
    }

    // Contar logs
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM reservation_logs WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.reserva_id) {
            paramCount++;
            sql += ` AND reserva_id = $${paramCount}`;
            params.push(filters.reserva_id);
        }

        if (filters.alterado_por_id) {
            paramCount++;
            sql += ` AND alterado_por_id = $${paramCount}`;
            params.push(filters.alterado_por_id);
        }

        const result = await query(sql, params);
        return parseInt(result.rows[0].total);
    }

    // Deletar logs antigos
    static async deleteOld(days = 90) {
        const sql = `
            DELETE FROM reservation_logs 
            WHERE data_alteracao < NOW() - INTERVAL '${days} days'
            RETURNING *
        `;
        
        const result = await query(sql);
        return result.rows;
    }

    // Estatísticas de logs
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN DATE(data_alteracao) = CURRENT_DATE THEN 1 END) as hoje,
                COUNT(CASE WHEN data_alteracao >= NOW() - INTERVAL '7 days' THEN 1 END) as ultimos_7_dias,
                COUNT(CASE WHEN data_alteracao >= NOW() - INTERVAL '30 days' THEN 1 END) as ultimos_30_dias,
                COUNT(DISTINCT reserva_id) as reservas_alteradas,
                COUNT(DISTINCT alterado_por_id) as usuarios_ativos
            FROM reservation_logs
        `;
        
        const result = await query(sql);
        return result.rows[0];
    }

    // Buscar atividade por período
    static async findActivity(dataInicio, dataFim) {
        const sql = `
            SELECT 
                DATE(rl.data_alteracao) as data,
                COUNT(*) as total_alteracoes,
                COUNT(DISTINCT rl.reserva_id) as reservas_alteradas,
                COUNT(DISTINCT rl.alterado_por_id) as usuarios_ativos
            FROM reservation_logs rl
            WHERE rl.data_alteracao >= $1 AND rl.data_alteracao <= $2
            GROUP BY DATE(rl.data_alteracao)
            ORDER BY data DESC
        `;
        
        const result = await query(sql, [dataInicio, dataFim]);
        return result.rows;
    }

    // Registrar criação de reserva
    static async logCreation(reservaId, usuarioId) {
        return this.create({
            reserva_id: reservaId,
            alterado_por_id: usuarioId,
            descricao: 'Reserva criada'
        });
    }

    // Registrar cancelamento de reserva
    static async logCancellation(reservaId, usuarioId, motivo = '') {
        const descricao = motivo ? `Reserva cancelada: ${motivo}` : 'Reserva cancelada';
        return this.create({
            reserva_id: reservaId,
            alterado_por_id: usuarioId,
            descricao: descricao
        });
    }

    // Registrar atualização de reserva
    static async logUpdate(reservaId, usuarioId, alteracoes = '') {
        const descricao = alteracoes ? `Reserva atualizada: ${alteracoes}` : 'Reserva atualizada';
        return this.create({
            reserva_id: reservaId,
            alterado_por_id: usuarioId,
            descricao: descricao
        });
    }
}

module.exports = ReservationLogModel;

