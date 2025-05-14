const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cursosRoutes = require("./routes/cursos.js");
const alunosRoutes = require("./routes/alunos.js");
const professoresRoutes = require("./routes/professores.js");
const app = express();
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/alunos", alunosRoutes);

app.get("/", (req, res) => {
  res.redirect("/alunos");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use("/cursos", cursosRoutes);
app.use("/professores", professoresRoutes);
