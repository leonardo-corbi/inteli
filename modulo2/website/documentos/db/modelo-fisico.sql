CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    matricula VARCHAR(50),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aluno', 'professor', 'admin'))
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(100),
    capacidade INTEGER,
    recursos TEXT
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pendente', 'aprovada', 'recusada')),
    CONSTRAINT horario_valido CHECK (data_inicio < data_fim)
);

CREATE TABLE reservation_logs (
    id SERIAL PRIMARY KEY,
    reserva_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    alterado_por_id INTEGER NOT NULL REFERENCES users(id),
    data_alteracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT
);
