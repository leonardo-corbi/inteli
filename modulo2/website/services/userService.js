const db = require("../config/db");

// Função para obter todos os usuários
const getAllUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter usuários: " + error.message);
  }
};

// Função para obter um usuário por ID
const getUserById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter usuário: " + error.message);
  }
};

// Função para criar um novo usuário
const createUser = async (nome, email, matricula, tipo) => {
  try {
    const result = await db.query(
      "INSERT INTO users (nome, email, matricula, tipo) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, matricula, tipo]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar usuário: " + error.message);
  }
};

// Função para atualizar um usuário por ID
const updateUser = async (id, nome, email, matricula, tipo) => {
  try {
    const result = await db.query(
      "UPDATE users SET nome = $1, email = $2, matricula = $3, tipo = $4 WHERE id = $5 RETURNING *",
      [nome, email, matricula, tipo, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar usuário: " + error.message);
  }
};

// Função para deletar um usuário por ID
const deleteUser = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar usuário: " + error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
