const { query } = require('../config/db');

class RoomModel {
    // Criar nova sala
    static async create(roomData) {
        const { nome, localizacao, capacidade, recursos = '' } = roomData;
        
        const sql = `
            INSERT INTO rooms (nome, localizacao, capacidade, recursos, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;
        
        const result = await query(sql, [nome, localizacao, capacidade, recursos]);
        return result.rows[0];
    }

    // Buscar sala por ID
    static async findById(id) {
        const sql = 'SELECT * FROM rooms WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Buscar sala por nome
    static async findByName(nome) {
        const sql = 'SELECT * FROM rooms WHERE nome = $1';
        const result = await query(sql, [nome]);
        return result.rows[0];
    }

    // Listar todas as salas
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM rooms WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.search) {
            paramCount++;
            sql += ` AND (nome ILIKE $${paramCount} OR localizacao ILIKE $${paramCount} OR recursos ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
        }

        if (filters.capacidade_min) {
            paramCount++;
            sql += ` AND capacidade >= $${paramCount}`;
            params.push(parseInt(filters.capacidade_min));
        }

        if (filters.capacidade_max) {
            paramCount++;
            sql += ` AND capacidade <= $${paramCount}`;
            params.push(parseInt(filters.capacidade_max));
        }

        sql += ' ORDER BY nome ASC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Atualizar sala
    static async update(id, roomData) {
        const { nome, localizacao, capacidade, recursos } = roomData;
        
        const sql = `
            UPDATE rooms 
            SET nome = $1, localizacao = $2, capacidade = $3, recursos = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING *
        `;
        
        const result = await query(sql, [nome, localizacao, capacidade, recursos, id]);
        return result.rows[0];
    }

    // Deletar sala
    static async delete(id) {
        const sql = 'DELETE FROM rooms WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Contar salas
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM rooms WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.capacidade_min) {
            paramCount++;
            sql += ` AND capacidade >= $${paramCount}`;
            params.push(parseInt(filters.capacidade_min));
        }

        const result = await query(sql, params);
        return parseInt(result.rows[0].total);
    }

    // Verificar se nome já existe
    static async nameExists(nome, excludeId = null) {
        let sql = 'SELECT id FROM rooms WHERE nome = $1';
        const params = [nome];

        if (excludeId) {
            sql += ' AND id != $2';
            params.push(excludeId);
        }

        const result = await query(sql, params);
        return result.rows.length > 0;
    }

    // Buscar salas disponíveis em um período
    static async findAvailable(dataInicio, dataFim) {
        const sql = `
            SELECT r.* FROM rooms r
            WHERE r.id NOT IN (
                SELECT DISTINCT res.sala_id 
                FROM reservations res 
                WHERE res.status = 'ativa'
                AND (
                    (res.data_inicio <= $1 AND res.data_fim > $1) OR
                    (res.data_inicio < $2 AND res.data_fim >= $2) OR
                    (res.data_inicio >= $1 AND res.data_fim <= $2)
                )
            )
            ORDER BY r.nome ASC
        `;
        
        const result = await query(sql, [dataInicio, dataFim]);
        return result.rows;
    }

    // Buscar salas por capacidade
    static async findByCapacity(minCapacity, maxCapacity = null) {
        let sql = 'SELECT * FROM rooms WHERE capacidade >= $1';
        const params = [minCapacity];

        if (maxCapacity) {
            sql += ' AND capacidade <= $2';
            params.push(maxCapacity);
        }

        sql += ' ORDER BY capacidade ASC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Buscar salas por localização
    static async findByLocation(localizacao) {
        const sql = 'SELECT * FROM rooms WHERE localizacao ILIKE $1 ORDER BY nome ASC';
        const result = await query(sql, [`%${localizacao}%`]);
        return result.rows;
    }

    // Estatísticas de salas
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                AVG(capacidade) as capacidade_media,
                MIN(capacidade) as capacidade_minima,
                MAX(capacidade) as capacidade_maxima,
                COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novas_30_dias
            FROM rooms
        `;
        
        const result = await query(sql);
        return result.rows[0];
    }

    // Buscar salas mais utilizadas
    static async findMostUsed(limit = 5) {
        const sql = `
            SELECT 
                r.*,
                COUNT(res.id) as total_reservas
            FROM rooms r
            LEFT JOIN reservations res ON r.id = res.sala_id
            GROUP BY r.id
            ORDER BY total_reservas DESC, r.nome ASC
            LIMIT $1
        `;
        
        const result = await query(sql, [limit]);
        return result.rows;
    }

    // Verificar disponibilidade de uma sala específica
    static async checkAvailability(roomId, dataInicio, dataFim, excludeReservationId = null) {
        let sql = `
            SELECT COUNT(*) as conflicts 
            FROM reservations 
            WHERE sala_id = $1 
            AND status = 'ativa'
            AND (
                (data_inicio <= $2 AND data_fim > $2) OR
                (data_inicio < $3 AND data_fim >= $3) OR
                (data_inicio >= $2 AND data_fim <= $3)
            )
        `;
        
        const params = [roomId, dataInicio, dataFim];

        if (excludeReservationId) {
            sql += ' AND id != $4';
            params.push(excludeReservationId);
        }

        const result = await query(sql, params);
        return parseInt(result.rows[0].conflicts) === 0;
    }
}

module.exports = RoomModel;

