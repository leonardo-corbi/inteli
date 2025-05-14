const Aluno = require("../models/aluno.js");
const Curso = require("../models/curso.js");

exports.index = async (req, res) => {
  const alunos = await Aluno.findAllComCurso();
  const cursos = await Curso.findAll();
  res.render("alunos/index", { alunos, cursos });
};

exports.store = async (req, res) => {
  await Aluno.create(req.body);
  res.redirect("/alunos");
};

exports.update = async (req, res) => {
  const { id } = req.params;
  await Aluno.update(id, req.body);
  res.redirect("/alunos");
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Aluno.delete(id);
  res.redirect("/alunos");
};

exports.byCurso = async (req, res) => {
  const { curso_id } = req.params;
  const alunos = await Aluno.findByCurso(curso_id);
  res.json(alunos);
};
