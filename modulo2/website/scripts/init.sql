-- Script de inicialização do banco de dados PostgreSQL
-- Sistema de Reserva de Salas

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255),
    tipo VARCHAR(20) DEFAULT 'usuario' CHECK (tipo IN ('admin', 'usuario')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de salas
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    capacidade INTEGER NOT NULL CHECK (capacidade > 0),
    recursos TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'cancelada', 'concluida', 'expirada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_data_fim_maior CHECK (data_fim > data_inicio)
);

-- Tabela de logs de reservas
CREATE TABLE IF NOT EXISTS reservation_logs (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    alterado_por_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_matricula ON users(matricula);
CREATE INDEX IF NOT EXISTS idx_users_tipo ON users(tipo);

CREATE INDEX IF NOT EXISTS idx_rooms_nome ON rooms(nome);
CREATE INDEX IF NOT EXISTS idx_rooms_capacidade ON rooms(capacidade);

CREATE INDEX IF NOT EXISTS idx_reservations_sala_id ON reservations(sala_id);
CREATE INDEX IF NOT EXISTS idx_reservations_usuario_id ON reservations(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservations_data_inicio ON reservations(data_inicio);
CREATE INDEX IF NOT EXISTS idx_reservations_data_fim ON reservations(data_fim);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_periodo ON reservations(data_inicio, data_fim);

CREATE INDEX IF NOT EXISTS idx_reservation_logs_reserva_id ON reservation_logs(reserva_id);
CREATE INDEX IF NOT EXISTS idx_reservation_logs_alterado_por_id ON reservation_logs(alterado_por_id);
CREATE INDEX IF NOT EXISTS idx_reservation_logs_data_alteracao ON reservation_logs(data_alteracao);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at 
    BEFORE UPDATE ON rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados iniciais
INSERT INTO users (nome, email, matricula, senha, tipo) VALUES
('Admin Sistema', 'admin@reservasalas.com', 'ADM001', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'admin'),
('João Silva', 'joao.silva@empresa.com', 'USR001', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'usuario'),
('Maria Santos', 'maria.santos@empresa.com', 'USR002', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'usuario'),
('Pedro Oliveira', 'pedro.oliveira@empresa.com', 'USR003', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'usuario')
ON CONFLICT (email) DO NOTHING;

INSERT INTO rooms (nome, localizacao, capacidade, recursos) VALUES
('Sala de Reunião A', 'Andar 1 - Ala Norte', 8, 'Projetor, TV 55", Ar condicionado, Quadro branco'),
('Sala de Reunião B', 'Andar 1 - Ala Sul', 12, 'Projetor, TV 65", Ar condicionado, Sistema de som'),
('Auditório Principal', 'Andar Térreo', 50, 'Projetor, Sistema de som, Microfones, Ar condicionado'),
('Sala de Treinamento', 'Andar 2 - Ala Norte', 20, 'Projetor, Computadores, Ar condicionado, Quadro branco'),
('Sala Executiva', 'Andar 3 - Diretoria', 6, 'TV 50", Ar condicionado, Mesa de reunião executiva')
ON CONFLICT (nome) DO NOTHING;

-- Inserir algumas reservas de exemplo
INSERT INTO reservations (sala_id, usuario_id, data_inicio, data_fim, observacoes, status) VALUES
(1, 2, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day 2 hours', 'Reunião de planejamento', 'ativa'),
(2, 3, CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 3 hours', 'Apresentação para clientes', 'ativa'),
(3, 4, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '3 days 4 hours', 'Treinamento anual', 'ativa')
ON CONFLICT DO NOTHING;

-- Views úteis
CREATE OR REPLACE VIEW vw_reservas_detalhadas AS
SELECT 
    r.id,
    r.data_inicio,
    r.data_fim,
    r.observacoes,
    r.status,
    r.created_at,
    s.nome as sala_nome,
    s.localizacao as sala_localizacao,
    s.capacidade as sala_capacidade,
    u.nome as usuario_nome,
    u.email as usuario_email,
    u.matricula as usuario_matricula
FROM reservations r
JOIN rooms s ON r.sala_id = s.id
JOIN users u ON r.usuario_id = u.id;

CREATE OR REPLACE VIEW vw_estatisticas_sistema AS
SELECT 
    (SELECT COUNT(*) FROM users) as total_usuarios,
    (SELECT COUNT(*) FROM users WHERE tipo = 'admin') as total_admins,
    (SELECT COUNT(*) FROM rooms) as total_salas,
    (SELECT COUNT(*) FROM reservations) as total_reservas,
    (SELECT COUNT(*) FROM reservations WHERE status = 'ativa') as reservas_ativas,
    (SELECT COUNT(*) FROM reservations WHERE DATE(data_inicio) = CURRENT_DATE) as reservas_hoje;

-- Função para verificar disponibilidade de sala
CREATE OR REPLACE FUNCTION verificar_disponibilidade_sala(
    p_sala_id INTEGER,
    p_data_inicio TIMESTAMP,
    p_data_fim TIMESTAMP,
    p_reserva_id INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflitos INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflitos
    FROM reservations
    WHERE sala_id = p_sala_id
    AND status = 'ativa'
    AND (
        (data_inicio <= p_data_inicio AND data_fim > p_data_inicio) OR
        (data_inicio < p_data_fim AND data_fim >= p_data_fim) OR
        (data_inicio >= p_data_inicio AND data_fim <= p_data_fim)
    )
    AND (p_reserva_id IS NULL OR id != p_reserva_id);
    
    RETURN conflitos = 0;
END;
$$ LANGUAGE plpgsql;

-- Função para cancelar reservas expiradas
CREATE OR REPLACE FUNCTION cancelar_reservas_expiradas()
RETURNS INTEGER AS $$
DECLARE
    reservas_canceladas INTEGER;
BEGIN
    UPDATE reservations 
    SET status = 'expirada', updated_at = CURRENT_TIMESTAMP
    WHERE status = 'ativa' 
    AND data_fim < CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS reservas_canceladas = ROW_COUNT;
    RETURN reservas_canceladas;
END;
$$ LANGUAGE plpgsql;

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON TABLE rooms IS 'Tabela de salas disponíveis para reserva';
COMMENT ON TABLE reservations IS 'Tabela de reservas de salas';
COMMENT ON TABLE reservation_logs IS 'Tabela de logs de alterações nas reservas';

COMMENT ON COLUMN users.tipo IS 'Tipo do usuário: admin ou usuario';
COMMENT ON COLUMN reservations.status IS 'Status da reserva: ativa, cancelada, concluida, expirada';

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '✅ Banco de dados inicializado com sucesso!';
    RAISE NOTICE '📊 Tabelas criadas: users, rooms, reservations, reservation_logs';
    RAISE NOTICE '🔍 Índices criados para otimização';
    RAISE NOTICE '⚡ Triggers e funções configurados';
    RAISE NOTICE '📝 Dados iniciais inseridos';
END $$;

