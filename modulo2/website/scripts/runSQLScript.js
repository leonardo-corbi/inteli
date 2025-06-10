const { Pool } = require('pg');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configuração da conexão PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runSQLScript() {
    const client = await pool.connect();
    
    try {
        console.log('🔌 Conectando ao PostgreSQL...');
        
        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, 'init.sql');
        const sqlScript = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('📄 Executando script SQL...');
        
        // Executar o script
        await client.query(sqlScript);
        
        console.log('✅ Script SQL executado com sucesso!');
        console.log('🎉 Banco de dados inicializado!');
        
        // Verificar se as tabelas foram criadas
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);
        
        console.log('📊 Tabelas criadas:');
        result.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });
        
        // Verificar dados iniciais
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        const roomCount = await client.query('SELECT COUNT(*) FROM rooms');
        
        console.log(`👥 Usuários cadastrados: ${userCount.rows[0].count}`);
        console.log(`🏢 Salas cadastradas: ${roomCount.rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Erro ao executar script SQL:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    runSQLScript()
        .then(() => {
            console.log('🚀 Inicialização concluída!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Falha na inicialização:', error);
            process.exit(1);
        });
}

module.exports = runSQLScript;

