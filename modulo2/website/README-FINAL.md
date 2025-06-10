# Sistema de Reserva de Salas - PostgreSQL

Sistema completo de reserva de salas desenvolvido em Node.js com PostgreSQL (Supabase).

## 🎯 **Características**

- ✅ **Arquitetura MVC** completa e organizada
- ✅ **PostgreSQL** com Supabase configurado
- ✅ **Sistema de autenticação** com login/registro
- ✅ **Interface responsiva** em tons de azul
- ✅ **CRUD completo** para salas, reservas e usuários
- ✅ **Sistema de logs** para auditoria
- ✅ **Validação de conflitos** de horários
- ✅ **Dashboard** com estatísticas

## 🗄️ **Banco de Dados**

O sistema utiliza PostgreSQL hospedado no Supabase com as seguintes tabelas:

- **users** - Usuários do sistema (admin/usuario)
- **rooms** - Salas disponíveis para reserva
- **reservations** - Reservas realizadas
- **reservation_logs** - Logs de alterações

## 🚀 **Instalação e Configuração**

### 1. **Extrair e Instalar**
```bash
# Extrair o ZIP
unzip reserva-salas-final-postgresql.zip
cd reserva-salas

# Instalar dependências
npm install
```

### 2. **Configurar Banco de Dados**
O arquivo `.env` já está configurado com as credenciais do PostgreSQL:

```env
DB_HOST=aws-0-sa-east-1.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.ycvkdtoxbanjkqwfvebx
DB_PASSWORD=560650Leo@
```

### 3. **Inicializar Banco**
```bash
# Executar script de inicialização (cria tabelas e dados iniciais)
node scripts/runSQLScript.js
```

### 4. **Executar Sistema**
```bash
# Iniciar servidor
npm start

# Ou usando Node diretamente
node server.js
```

### 5. **Acessar Sistema**
- **URL:** http://localhost:3000/login
- **Admin:** admin@reservasalas.com / admin123
- **Usuário:** joao.silva@empresa.com / 123456

## 📊 **Funcionalidades**

### 🔐 **Autenticação**
- Login/logout com sessões
- Registro de novos usuários
- Middleware de proteção de rotas
- Diferentes níveis de acesso (admin/usuario)

### 🏢 **Gestão de Salas**
- Listagem com filtros e busca
- Cadastro de novas salas
- Edição e exclusão
- Verificação de disponibilidade

### 📅 **Sistema de Reservas**
- Criação de reservas com validação
- Verificação de conflitos de horário
- Cancelamento e alteração
- Histórico completo

### 👥 **Gestão de Usuários**
- CRUD completo de usuários
- Controle de tipos (admin/usuario)
- Validação de email e matrícula únicos

### 📋 **Sistema de Logs**
- Registro automático de alterações
- Auditoria completa do sistema
- Histórico de ações por usuário

## 🎨 **Interface**

- **Design moderno** em tons de azul
- **Layout responsivo** para desktop e mobile
- **Sidebar fixa** com navegação intuitiva
- **Ícones Lucide** e tipografia Google Fonts
- **Animações suaves** e feedback visual

## 🔧 **Tecnologias**

- **Backend:** Node.js, Express.js
- **Banco:** PostgreSQL (Supabase)
- **Frontend:** EJS, CSS3, JavaScript
- **Autenticação:** Express-session, bcrypt
- **Outros:** dotenv, pg (PostgreSQL driver)

## 📁 **Estrutura do Projeto**

```
reserva-salas/
├── config/          # Configurações do banco
├── controllers/     # Lógica de negócio
├── models/          # Modelos de dados
├── routes/          # Rotas da aplicação
├── views/           # Templates EJS
├── scripts/         # Scripts de inicialização
├── assets/          # Arquivos estáticos
└── server.js        # Servidor principal
```

## 🔑 **Contas de Teste**

### Administrador
- **Email:** admin@reservasalas.com
- **Senha:** admin123
- **Permissões:** Acesso total ao sistema

### Usuários
- **João Silva:** joao.silva@empresa.com / 123456
- **Maria Santos:** maria.santos@empresa.com / 123456
- **Pedro Oliveira:** pedro.oliveira@empresa.com / 123456

## 🏢 **Salas Pré-cadastradas**

1. **Sala de Reunião A** - 8 pessoas (Andar 1)
2. **Sala de Reunião B** - 12 pessoas (Andar 1)
3. **Auditório Principal** - 50 pessoas (Térreo)
4. **Sala de Treinamento** - 20 pessoas (Andar 2)
5. **Sala Executiva** - 6 pessoas (Andar 3)

## 🛠️ **Scripts Disponíveis**

```bash
# Iniciar servidor
npm start

# Inicializar banco de dados
node scripts/runSQLScript.js

# Modo desenvolvimento (se configurado)
npm run dev
```

## 📝 **Observações**

- O sistema está configurado para PostgreSQL do Supabase
- As senhas são criptografadas com bcrypt
- Sessões são gerenciadas pelo express-session
- SSL está configurado para conexão segura
- Todas as queries usam prepared statements para segurança

## 🎉 **Sistema Pronto para Uso**

O sistema está completamente funcional e testado. Todas as funcionalidades foram implementadas e validadas com o banco PostgreSQL do Supabase.

---

**Desenvolvido com ❤️ usando Node.js e PostgreSQL**

