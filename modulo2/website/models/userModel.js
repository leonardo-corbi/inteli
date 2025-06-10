const { query } = require('../config/db');

class UserModel {
    // Criar novo usuário
    static async create(userData) {
        const { nome, email, matricula, tipo = 'usuario', senha } = userData;
        
        const sql = `
            INSERT INTO users (nome, email, matricula, tipo, senha, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            RETURNING *
        `;
        
        const result = await query(sql, [nome, email, matricula, tipo, senha]);
        return result.rows[0];
    }

    // Buscar usuário por ID
    static async findById(id) {
        const sql = 'SELECT * FROM users WHERE id = $1';
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Buscar usuário por email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const result = await query(sql, [email]);
        return result.rows[0];
    }

    // Buscar usuário por matrícula
    static async findByMatricula(matricula) {
        const sql = 'SELECT * FROM users WHERE matricula = $1';
        const result = await query(sql, [matricula]);
        return result.rows[0];
    }

    // Listar todos os usuários
    static async findAll(filters = {}) {
        let sql = 'SELECT * FROM users WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.search) {
            paramCount++;
            sql += ` AND (nome ILIKE $${paramCount} OR email ILIKE $${paramCount} OR matricula ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
        }

        if (filters.tipo) {
            paramCount++;
            sql += ` AND tipo = $${paramCount}`;
            params.push(filters.tipo);
        }

        sql += ' ORDER BY created_at DESC';

        const result = await query(sql, params);
        return result.rows;
    }

    // Atualizar usuário
    static async update(id, userData) {
        const { nome, email, matricula, tipo } = userData;
        
        const sql = `
            UPDATE users 
            SET nome = $1, email = $2, matricula = $3, tipo = $4, updated_at = NOW()
            WHERE id = $5
            RETURNING *
        `;
        
        const result = await query(sql, [nome, email, matricula, tipo, id]);
        return result.rows[0];
    }

    // Atualizar senha
    static async updatePassword(id, hashedPassword) {
        const sql = `
            UPDATE users 
            SET senha = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        
        const result = await query(sql, [hashedPassword, id]);
        return result.rows[0];
    }

    // Deletar usuário
    static async delete(id) {
        const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const result = await query(sql, [id]);
        return result.rows[0];
    }

    // Contar usuários
    static async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (filters.tipo) {
            paramCount++;
            sql += ` AND tipo = $${paramCount}`;
            params.push(filters.tipo);
        }

        const result = await query(sql, params);
        return parseInt(result.rows[0].total);
    }

    // Verificar se email já existe
    static async emailExists(email, excludeId = null) {
        let sql = 'SELECT id FROM users WHERE email = $1';
        const params = [email];

        if (excludeId) {
            sql += ' AND id != $2';
            params.push(excludeId);
        }

        const result = await query(sql, params);
        return result.rows.length > 0;
    }

    // Verificar se matrícula já existe
    static async matriculaExists(matricula, excludeId = null) {
        let sql = 'SELECT id FROM users WHERE matricula = $1';
        const params = [matricula];

        if (excludeId) {
            sql += ' AND id != $2';
            params.push(excludeId);
        }

        const result = await query(sql, params);
        return result.rows.length > 0;
    }

    // Buscar usuários recentes
    static async findRecent(limit = 5) {
        const sql = `
            SELECT * FROM users 
            ORDER BY created_at DESC 
            LIMIT $1
        `;
        
        const result = await query(sql, [limit]);
        return result.rows;
    }

    // Estatísticas de usuários
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN tipo = 'admin' THEN 1 END) as admins,
                COUNT(CASE WHEN tipo = 'usuario' THEN 1 END) as usuarios,
                COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novos_30_dias
            FROM users
        `;
        
        const result = await query(sql);
        return result.rows[0];
    }
}

module.exports = UserModel;

