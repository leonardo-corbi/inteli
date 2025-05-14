-- Tabela: curso
CREATE TABLE IF NOT EXISTS curso (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL
);

-- Tabela: aluno
CREATE TABLE IF NOT EXISTS aluno (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    curso_id INT REFERENCES curso(id)
);

-- Tabela: cursos
CREATE TABLE IF NOT EXISTS cursos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    duracao_anos INT
);

-- Tabela: alunos
CREATE TABLE IF NOT EXISTS alunos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    curso TEXT
);

-- Tabela: matriculas
CREATE TABLE IF NOT EXISTS matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id),
    curso_id INT REFERENCES cursos(id),
    data_matricula DATE
);

-- Tabela: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);

-- Tabela: professor
CREATE TABLE IF NOT EXISTS professor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR NOT NULL
);
