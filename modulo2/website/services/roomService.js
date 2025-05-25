const db = require("../config/db");

// Função para obter todas as salas
const getAllRooms = async () => {
  try {
    const result = await db.query("SELECT * FROM rooms ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter salas: " + error.message);
  }
};

// Função para obter uma sala por ID
const getRoomById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM rooms WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter sala: " + error.message);
  }
};

// Função para criar uma nova sala
const createRoom = async (nome, localizacao, capacidade, recursos) => {
  try {
    const result = await db.query(
      "INSERT INTO rooms (nome, localizacao, capacidade, recursos) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, localizacao, capacidade, recursos || null]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar sala: " + error.message);
  }
};

// Função para atualizar uma sala por ID
const updateRoom = async (id, nome, localizacao, capacidade, recursos) => {
  try {
    const result = await db.query(
      "UPDATE rooms SET nome = $1, localizacao = $2, capacidade = $3, recursos = $4 WHERE id = $5 RETURNING *",
      [nome, localizacao, capacidade, recursos || null, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar sala: " + error.message);
  }
};

// Função para deletar uma sala por ID
const deleteRoom = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM rooms WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar sala: " + error.message);
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
