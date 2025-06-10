const { Pool } = require('pg');
require('dotenv').config();

// Configuração da conexão PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Necessário para Supabase
    },
    max: 20, // Máximo de conexões no pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.on('connect', () => {
    console.log('✅ Conectado ao PostgreSQL (Supabase)');
});

pool.on('error', (err) => {
    console.error('❌ Erro na conexão PostgreSQL:', err);
});

// Função para executar queries
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Query executada:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Erro na query:', error);
        throw error;
    }
};

// Função para obter um cliente do pool
const getClient = async () => {
    return await pool.connect();
};

// Função para fechar o pool
const closePool = async () => {
    await pool.end();
    console.log('🔌 Pool PostgreSQL fechado');
};

module.exports = {
    query,
    getClient,
    closePool,
    pool
};

