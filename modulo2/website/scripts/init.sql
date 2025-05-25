CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL,
    recursos TEXT
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    sala_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (sala_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reservation_logs (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL,
    alterado_por_id INT NOT NULL,
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    FOREIGN KEY (reserva_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (alterado_por_id) REFERENCES users(id) ON DELETE CASCADE
);