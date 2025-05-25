const db = require("../config/db");

// Função para obter todas as reservas
const getAllReservations = async () => {
  try {
    const result = await db.query("SELECT * FROM reservations ORDER BY id ASC");
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter reservas: " + error.message);
  }
};

// Função para obter uma reserva por ID
const getReservationById = async (id) => {
  try {
    const result = await db.query("SELECT * FROM reservations WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter reserva: " + error.message);
  }
};

// Função para criar uma nova reserva
const createReservation = async (
  sala_id,
  usuario_id,
  data_inicio,
  data_fim,
  status
) => {
  try {
    const result = await db.query(
      "INSERT INTO reservations (sala_id, usuario_id, data_inicio, data_fim, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [sala_id, usuario_id, data_inicio, data_fim, status]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar reserva: " + error.message);
  }
};

// Função para atualizar uma reserva por ID
const updateReservation = async (
  id,
  sala_id,
  usuario_id,
  data_inicio,
  data_fim,
  status
) => {
  try {
    const result = await db.query(
      "UPDATE reservations SET sala_id = $1, usuario_id = $2, data_inicio = $3, data_fim = $4, status = $5 WHERE id = $6 RETURNING *",
      [sala_id, usuario_id, data_inicio, data_fim, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao atualizar reserva: " + error.message);
  }
};

// Função para deletar uma reserva por ID
const deleteReservation = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar reserva: " + error.message);
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
