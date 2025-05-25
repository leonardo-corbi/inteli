📅 Reserva de Salas
🎯 Descrição do Projeto
Reserva de Salas é um sistema web desenvolvido para o Inteli para facilitar o agendamento de salas de reunião no Inteli. O projeto foi criado para resolver a desorganização enfrentada na reserva de salas, centralizando as solicitações em um único sistema web. Este sistema permite que usuários visualizem salas disponíveis, solicitem reservas para horários específicos, acompanhem o status de suas solicitações, e que administradores gerenciem e aprovem/rejeitem essas reservas.
Funcionalidades Principais

Visualizar salas disponíveis com seus recursos e capacidades.
Solicitar reservas para horários específicos.
Acompanhar o status da solicitação (pendente, aprovada, recusada).
Administradores podem aprovar ou recusar reservas.
Registrar logs de alterações nas reservas para auditoria.


📊 Modelo Físico do Banco de Dados
O banco de dados é composto por quatro tabelas:
Tabela users

id: Chave primária (SERIAL).
nome: Nome do usuário (VARCHAR, obrigatório).
email: Email do usuário (VARCHAR, obrigatório, único).
matricula: Matrícula do usuário (VARCHAR, obrigatório, único).
tipo: Tipo do usuário (VARCHAR, obrigatório, ex.: "admin", "comum").

Tabela rooms

id: Chave primária (SERIAL).
nome: Nome da sala (VARCHAR, obrigatório).
localizacao: Localização da sala (VARCHAR, obrigatório).
capacidade: Capacidade da sala (INT, obrigatório).
recursos: Recursos disponíveis na sala (TEXT, opcional).

Tabela reservations

id: Chave primária (SERIAL).
sala_id: Chave estrangeira referenciando rooms(id) (INT, obrigatório).
usuario_id: Chave estrangeira referenciando users(id) (INT, obrigatório).
data_inicio: Data e hora de início da reserva (TIMESTAMP, obrigatório).
data_fim: Data e hora de fim da reserva (TIMESTAMP, obrigatório).
status: Status da reserva (VARCHAR, obrigatório, ex.: "pendente", "aprovada", "recusada").
Chaves estrangeiras com ON DELETE CASCADE.

Tabela reservation_logs

id: Chave primária (SERIAL).
reserva_id: Chave estrangeira referenciando reservations(id) (INT, obrigatório).
alterado_por_id: Chave estrangeira referenciando users(id) (INT, obrigatório).
data_alteracao: Data da alteração (TIMESTAMP, padrão CURRENT_TIMESTAMP).
descricao: Descrição da alteração (TEXT, opcional).
Chaves estrangeiras com ON DELETE CASCADE.

O script SQL para criar as tabelas está em scripts/init.sql

🗂️ Estrutura de Pastas e Arquivos
/website
│
├── assets/                   # Arquivos estáticos (ícones, imagens)
│   └── favicon.ico
│
├── config/                   # Configurações do banco e ambiente
│   └── db.js
│
├── controllers/              # Lógica dos controladores
│   ├── userController.js
│   ├── roomController.js
│   ├── reservationController.js
│   └── reservationLogController.js
│
├── documentos/               # Documentação e arquivos auxiliares
│   ├── db/
│   │   └── modelo-relacional.jpeg
│   └── wad.md
│
├── models/                   # Modelos da aplicação
│   ├── userModel.js
│   ├── roomModel.js
│   ├── reservationModel.js
│   └── reservationLogModel.js
│
├── routes/                   # Rotas da aplicação
│   ├── frontRoutes.js
│   ├── userRoutes.js
│   ├── roomRoutes.js
│   ├── reservationRoutes.js
│   └── reservationLogRoutes.js
│
├── scripts/                  # Scripts de banco e inicialização
│   ├── init.sql             # Alias para modelo-fisico.sql
│   └── runSQLScript.js
│
├── services/                 # Serviços de regra de negócio
│   ├── userService.js
│   ├── roomService.js
│   ├── reservationService.js
│   └── reservationLogService.js
│
├── tests/                    # Testes automatizados
│
├── views/                    # Páginas renderizadas ou templates
│   ├── layout/
│   │   └── main.ejs
│   └── pages/
│       ├── index.ejs
│       └── about.ejs
│
├── public/                   # Arquivos estáticos como CSS
│   └── styles.css
│
├── .env                      # Variáveis de ambiente
├── .gitignore                # Arquivos ignorados pelo Git
├── jest.config.js            # Configuração de testes
├── package.json              # Dependências e scripts do projeto
├── package-lock.json         # Versão travada das dependências
├── readme.md                 # Documentação principal
├── rest.http                 # Testes manuais de rotas (REST Client)
└── server.js                 # Arquivo principal do backend
├── app.js                    # Módulo opcional do backend


🧪 Como Executar o Projeto Localmente
✅ Requisitos

Node.js (v18 ou superior)
PostgreSQL (v12 ou superior)
Git

📥 1. Clone o repositório
git clone https://github.com/leonardo-corbi/inteli.git
cd ./modulo2/website/

📦 2. Instale as dependências
npm install

🔧 3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_PORT=5432
PORT=3000

🛠️ 4. Inicialize o banco de dados
Execute o script SQL para criar as tabelas:
npm run init-db

🚀 5. Inicie o backend
npm run start

🌐 6. Acesse o sistema
Abra o navegador e acesse http://localhost:3000 para a página inicial

📡 Endpoints da API
Usuários (/users)

GET /users: Lista todos os usuários.
GET /users/:id: Busca um usuário por ID.
POST /users: Cria um novo usuário.
Corpo: { "nome": "string", "email": "string", "matricula": "string", "tipo": "string" }


POST /users/edit/:id: Atualiza um usuário.
Corpo: { "nome": "string", "email": "string", "matricula": "string", "tipo": "string" }


POST /users/delete/:id: Exclui um usuário.

Salas (/rooms)

GET /rooms: Lista todas as salas.
GET /rooms/:id: Busca uma sala por ID.
POST /rooms: Cria uma nova sala.
Corpo: { "nome": "string", "localizacao": "string", "capacidade": number, "recursos": "string" }


POST /rooms/edit/:id: Atualiza uma sala.
Corpo: { "nome": "string", "localizacao": "string", "capacidade": number, "recursos": "string" }


POST /rooms/delete/:id: Exclui uma sala.

Reservas (/reservations)

GET /reservations: Lista todas as reservas.
GET /reservations/:id: Busca uma reserva por ID.
POST /reservations: Cria uma nova reserva.
Corpo: { "sala_id": number, "usuario_id": number, "data_inicio": "string", "data_fim": "string", "status": "string" }


POST /reservations/edit/:id: Atualiza uma reserva.
Corpo: { "sala_id": number, "usuario_id": number, "data_inicio": "string", "data_fim": "string", "status": "string" }


POST /reservations/delete/:id: Exclui uma reserva.

Logs de Reservas (/reservation-logs)

GET /reservation-logs: Lista todos os logs de reservas.
GET /reservation-logs/:id: Busca um log de reserva por ID.
GET /reservation-logs/reservation/:reserva_id: Lista os logs de uma reserva específica.
POST /reservation-logs: Cria um novo log de reserva.
Corpo: { "reserva_id": number, "alterado_por_id": number, "descricao": "string" }


POST /reservation-logs/delete/:id: Exclui um log de reserva.