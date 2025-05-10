
# 📅 Reserva de Salas

## 🎯 Descrição do Projeto

**Reserva de Salas** é um sistema web desenvolvido para o Inteli para facilitar o agendamento de **salas de reunião no Inteli**. O projeto surgiu para resolver a desorganização enfrentada na reserva de salas, centralizando as solicitações em um único sistema.

Com o Reserva de Salas, é possível:
- Visualizar salas disponíveis com seus recursos e capacidades
- Solicitar reservas para horários específicos
- Acompanhar o status da sua solicitação (pendente, aprovada, recusada)
- Administradores podem aprovar ou recusar as reservas feitas

---

## 🗂️ Estrutura de Pastas e Arquivos

```
/website
│
├── assets/                   # Arquivos estáticos (ícones, imagens)
│   └── favicon.ico
│
├── config/                   # Configurações do banco e ambiente
│   └── db.js
│
├── controllers/              # Lógica dos controladores
│   └── userController.js
│
├── documentos/               # Documentação e arquivos auxiliares
│   ├── db/
│   │   ├── modelo-fisico.sql
│   │   └── modelo-relacional.jpeg
│   └── wad.md
│
├── models/                   # Modelos da aplicação
│   └── userModel.js
│
├── routes/                   # Rotas da aplicação
│   ├── frontRoutes.js
│   └── userRoutes.js
│
├── scripts/                  # Scripts de banco e inicialização
│   ├── init.sql
│   └── runSQLScript.js
│
├── services/                 # Serviços de regra de negócio
│   └── userService.js
│
├── tests/                    # Testes automatizados
│
├── views/                    # Páginas renderizadas ou templates (se houver)
│
├── .env                      # Variáveis de ambiente
├── .gitignore                # Arquivos ignorados pelo Git
├── jest.config.js            # Configuração de testes
├── package.json              # Dependências e scripts do projeto
├── package-lock.json         # Versão travada das dependências
├── readme.md                 # Documentação principal
├── rest.http                 # Testes manuais de rotas (REST Client)
└── server.js                 # Arquivo principal do backend
```

---

## 🧪 Como Executar o Projeto Localmente

### ✅ Requisitos

- Node.js (v18 ou superior)
- Git

### 📥 1. Clone o repositório

```bash
git clone https://github.com/leonardo-corbi/inteli.git
cd ./modulo2/website/
```
### 🚀 2. Inicie o backend

```bash
node run start
```

Pronto! O projeto estará rodando localmente.