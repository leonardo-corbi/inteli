const db = require("../config/db");

// Função para obter todos os logs de reservas
const getAllReservationLogs = async () => {
  try {
    const result = await db.query(
      "SELECT * FROM reservation_logs ORDER BY id ASC"
    );
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter logs de reservas: " + error.message);
  }
};

// Função para obter um log de reserva por ID
const getReservationLogById = async (id) => {
  try {
    const result = await db.query(
      "SELECT * FROM reservation_logs WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao obter log de reserva: " + error.message);
  }
};

// Função para obter logs por ID de reserva
const getLogsByReservationId = async (reserva_id) => {
  try {
    const result = await db.query(
      "SELECT * FROM reservation_logs WHERE reserva_id = $1 ORDER BY data_alteracao ASC",
      [reserva_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao obter logs da reserva: " + error.message);
  }
};

// Função para criar um novo log de reserva
const createReservationLog = async (reserva_id, alterado_por_id, descricao) => {
  try {
    const result = await db.query(
      "INSERT INTO reservation_logs (reserva_id, alterado_por_id, data_alteracao, descricao) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *",
      [reserva_id, alterado_por_id, descricao || null]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao criar log de reserva: " + error.message);
  }
};

// Função para deletar um log de reserva por ID
const deleteReservationLog = async (id) => {
  try {
    const result = await db.query(
      "DELETE FROM reservation_logs WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao deletar log de reserva: " + error.message);
  }
};

module.exports = {
  getAllReservationLogs,
  getReservationLogById,
  getLogsByReservationId,
  createReservationLog,
  deleteReservationLog,
};
