-- Criação das tabelas
CREATE TABLE alunos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  turma TEXT NOT NULL,
  curso TEXT NOT NULL,
  data_nascimento DATE
);

CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  duracao_anos INT
);

CREATE TABLE matriculas (
  id SERIAL PRIMARY KEY,
  aluno_id INT REFERENCES alunos(id) ON DELETE CASCADE,
  curso_id INT REFERENCES cursos(id) ON DELETE CASCADE,
  data_matricula DATE DEFAULT CURRENT_DATE
);

-- Inserir cursos
INSERT INTO cursos (nome, duracao_anos)
VALUES 
  ('Engenharia Civil', 5),
  ('Administração', 4),
  ('Direito', 5),
  ('Ciência da Computação', 4),
  ('Medicina', 6);

-- Inserir alunos
INSERT INTO alunos (nome, turma, curso, data_nascimento)
VALUES 
  ('Ana Lima', '1A', 'Engenharia Civil', '2002-05-10'),
  ('Bruno Souza', '1B', 'Administração', '2003-08-15'),
  ('Carlos Mendes', '2A', 'Direito', '2001-11-20'),
  ('Daniela Pires', '2B', 'Medicina', '2000-07-30'),
  ('Eduardo Silva', '3A', 'Ciência da Computação', '2002-03-25'),
  ('Fernanda Costa', '3B', 'Engenharia Civil', '2001-12-15'),
  ('Gabriel Rocha', '1C', 'Administração', '2003-02-10'),
  ('Helena Martins', '2C', 'Direito', '2001-09-05'),
  ('Igor Almeida', '3C', 'Ciência da Computação', '2002-06-18'),
  ('Juliana Teixeira', '1D', 'Medicina', '2000-04-27'),
  ('Lucas Pereira', '2D', 'Engenharia Civil', '2001-05-09'),
  ('Mariana Souza', '3D', 'Direito', '2002-08-12');

-- Inserir matrículas
INSERT INTO matriculas (aluno_id, curso_id)
VALUES 
  (1, 1), -- Ana Lima -> Engenharia Civil
  (2, 2), -- Bruno Souza -> Administração
  (3, 3), -- Carlos Mendes -> Direito
  (4, 5), -- Daniela Pires -> Medicina
  (5, 4), -- Eduardo Silva -> Ciência da Computação
  (6, 1), -- Fernanda Costa -> Engenharia Civil
  (7, 2), -- Gabriel Rocha -> Administração
  (8, 3), -- Helena Martins -> Direito
  (9, 4), -- Igor Almeida -> Ciência da Computação
  (10, 5), -- Juliana Teixeira -> Medicina
  (11, 1), -- Lucas Pereira -> Engenharia Civil
  (12, 3); -- Mariana Souza -> Direito

-- CONSULTAS UTILIZANDO JOIN

-- 1. Listar alunos com o nome do curso
SELECT 
  alunos.nome AS aluno_nome,
  cursos.nome AS curso_nome
FROM 
  alunos
JOIN 
  matriculas ON alunos.id = matriculas.aluno_id
JOIN 
  cursos ON cursos.id = matriculas.curso_id;

-- 2. Listar alunos com turma, data de nascimento e curso
SELECT 
  alunos.nome AS aluno_nome,
  alunos.turma,
  alunos.data_nascimento,
  cursos.nome AS curso_nome
FROM 
  alunos
JOIN 
  matriculas ON alunos.id = matriculas.aluno_id
JOIN 
  cursos ON cursos.id = matriculas.curso_id
ORDER BY 
  alunos.nome;

-- 3. Contar quantos alunos estão matriculados em cada curso
SELECT 
  cursos.nome AS curso_nome,
  COUNT(matriculas.id) AS total_alunos
FROM 
  cursos
LEFT JOIN 
  matriculas ON cursos.id = matriculas.curso_id
GROUP BY 
  cursos.nome
ORDER BY 
  total_alunos DESC;
