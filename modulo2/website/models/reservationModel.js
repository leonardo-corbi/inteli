const { query } = require('../config/db');

class ReservationModel {
    // Criar nova reserva
    static async create(reservationData) {
        const { sala_id, usuario_id, data_inicio, data_fim, observacoes = '' } = reservationData;
        
        const sql = `
            INSERT INTO reservations (sala_id, usuario_id, data_inicio, data_fim, observacoes, status, created_at)
            VALUES ($1, $2, $3, $4, $5, 'ativa', NOW())
            RETURNING *
        `;
        
        const result = await query(sql, [sala_id, usuario_id, data_inicio, data_fim, observacoes]);
        return result.rows[0];
    }

    // Buscar reserva por ID
    static async findById(id) {
        const sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                s.localizacao as sala_localizacao,
                s.capacidade as sala_capacidade,
                u.nome as usuario_nome,
                u.email as usuario_email,
                u.matricula as usuario_matricula
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE r.id = $1
        `;
        
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Listar todas as reservas
    static async findAll(filters = {}) {
        let sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                s.localizacao as sala_localizacao,
                u.nome as usuario_nome,
                u.email as usuario_email
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE 1=1
        `;
        
        const params = [];
        let paramCount = 0;

        if (filters.status) {
            paramCount++;
            sql += ` AND r.status = $${paramCount}`;
            params.push(filters.status);
        }

        if (filters.sala_id) {
            paramCount++;
            sql += ` AND r.sala_id = $${paramCount}`;
            params.push(parseInt(filters.sala_id));
        }

        if (filters.usuario_id) {
            paramCount++;
            sql += ` AND r.usuario_id = $${paramCount}`;
            params.push(parseInt(filters.usuario_id));
        }

        if (filters.data_inicio) {
            paramCount++;
            sql += ` AND r.data_inicio >= $${paramCount}`;
            params.push(filters.data_inicio);
        }

        if (filters.data_fim) {
            paramCount++;
            sql += ` AND r.data_fim <= $${paramCount}`;
            params.push(filters.data_fim);
        }

        if (filters.search) {
            paramCount++;
            sql += ` AND (s.nome ILIKE $${paramCount} OR u.nome ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
        }

        sql += ' ORDER BY r.data_inicio DESC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Atualizar reserva
    static async update(id, reservationData) {
        const { sala_id, usuario_id, data_inicio, data_fim, observacoes, status } = reservationData;
        
        const sql = `
            UPDATE reservations 
            SET sala_id = $1, usuario_id = $2, data_inicio = $3, data_fim = $4, 
                observacoes = $5, status = $6, updated_at = NOW()
            WHERE id = $7
            RETURNING *
        `;
        
        const result = await query(sql, [sala_id, usuario_id, data_inicio, data_fim, observacoes, status, id]);
        return result.rows[0];
    }

    // Atualizar status da reserva
    static async updateStatus(id, status) {
        const sql = `
            UPDATE reservations 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await query(sql, [status, id]);
        return result.rows[0];
    }

    // Deletar reserva
    static async delete(id) {
        const sql = 'DELETE FROM reservations WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Verificar conflitos de horário
    static async checkConflicts(sala_id, data_inicio, data_fim, excludeId = null) {
        let sql = `
            SELECT * FROM reservations 
            WHERE sala_id = $1 
            AND status = 'ativa'
            AND (
                (data_inicio <= $2 AND data_fim > $2) OR
                (data_inicio < $3 AND data_fim >= $3) OR
                (data_inicio >= $2 AND data_fim <= $3)
            )
        `;
        
        const params = [sala_id, data_inicio, data_fim];

        if (excludeId) {
            sql += ' AND id != $4';
            params.push(excludeId);
        }

        const result = await query(sql, params);
        return result.rows;
    }

    // Buscar reservas por usuário
    static async findByUser(userId, filters = {}) {
        let sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                s.localizacao as sala_localizacao
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            WHERE r.usuario_id = $1
        `;
        
        const params = [userId];
        let paramCount = 1;

        if (filters.status) {
            paramCount++;
            sql += ` AND r.status = $${paramCount}`;
            params.push(filters.status);
        }

        sql += ' ORDER BY r.data_inicio DESC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Buscar reservas por sala
    static async findByRoom(roomId, filters = {}) {
        let sql = `
            SELECT 
                r.*,
                u.nome as usuario_nome,
                u.email as usuario_email
            FROM reservations r
            JOIN users u ON r.usuario_id = u.id
            WHERE r.sala_id = $1
        `;
        
        const params = [roomId];
        let paramCount = 1;

        if (filters.status) {
            paramCount++;
            sql += ` AND r.status = $${paramCount}`;
            params.push(filters.status);
        }

        if (filters.data_inicio) {
            paramCount++;
            sql += ` AND r.data_inicio >= $${paramCount}`;
            params.push(filters.data_inicio);
        }

        sql += ' ORDER BY r.data_inicio ASC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Buscar reservas do dia
    static async findToday() {
        const sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                u.nome as usuario_nome
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE DATE(r.data_inicio) = CURRENT_DATE
            AND r.status = 'ativa'
            ORDER BY r.data_inicio ASC
        `;
        
        const result = await query(sql);
        return result.rows;
    }

    // Buscar próximas reservas
    static async findUpcoming(limit = 10) {
        const sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                u.nome as usuario_nome
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE r.data_inicio > NOW()
            AND r.status = 'ativa'
            ORDER BY r.data_inicio ASC
            LIMIT $1
        `;
        
        const result = await query(sql, [limit]);
        return result.rows;
    }

    // Contar reservas
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM reservations WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.status) {
            paramCount++;
            sql += ` AND status = $${paramCount}`;
            params.push(filters.status);
        }

        if (filters.usuario_id) {
            paramCount++;
            sql += ` AND usuario_id = $${paramCount}`;
            params.push(filters.usuario_id);
        }

        const result = await query(sql, params);
        return parseInt(result.rows[0].total);
    }

    // Estatísticas de reservas
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'ativa' THEN 1 END) as ativas,
                COUNT(CASE WHEN status = 'cancelada' THEN 1 END) as canceladas,
                COUNT(CASE WHEN status = 'concluida' THEN 1 END) as concluidas,
                COUNT(CASE WHEN DATE(data_inicio) = CURRENT_DATE THEN 1 END) as hoje,
                COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novas_30_dias
            FROM reservations
        `;
        
        const result = await query(sql);
        return result.rows[0];
    }

    // Buscar reservas por período
    static async findByPeriod(dataInicio, dataFim) {
        const sql = `
            SELECT 
                r.*,
                s.nome as sala_nome,
                u.nome as usuario_nome
            FROM reservations r
            JOIN rooms s ON r.sala_id = s.id
            JOIN users u ON r.usuario_id = u.id
            WHERE r.data_inicio >= $1 AND r.data_fim <= $2
            ORDER BY r.data_inicio ASC
        `;
        
        const result = await query(sql, [dataInicio, dataFim]);
        return result.rows;
    }

    // Cancelar reservas expiradas
    static async cancelExpired() {
        const sql = `
            UPDATE reservations 
            SET status = 'expirada', updated_at = NOW()
            WHERE status = 'ativa' 
            AND data_fim < NOW()
            RETURNING *
        `;
        
        const result = await query(sql);
        return result.rows;
    }
}

module.exports = ReservationModel;

