require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db");

const app = express();

// Configuração do EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json()); // Para parsing de JSON (APIs REST)
app.use(bodyParser.urlencoded({ extended: true })); // Para parsing de formulários
app.use(express.static(path.join(__dirname, "public"))); // Para arquivos estáticos

// Rotas da API
const userRoutes = require("./routes/userRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const reservationLogRoutes = require("./routes/reservationLogRoutes");

app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservations", reservationRoutes);
app.use("/reservation-logs", reservationLogRoutes);

// Rotas do frontend
const frontRoutes = require("./routes/frontRoutes");
app.use("/", frontRoutes);

// Middleware para lidar com erros de rota não encontrada
app.use((req, res, next) => {
  res.status(404).send("Página não encontrada");
});

// Middleware para lidar com erros internos do servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Erro no servidor");
});

// Conexão com o banco de dados e inicialização do servidor
db.connect()
  .then(() => {
    console.log("Conectado ao banco de dados PostgreSQL");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });
