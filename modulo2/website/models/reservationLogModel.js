const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO reservation_logs (reserva_id, alterado_por_id, data_alteracao, descricao) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *";
    const values = [
      data.reserva_id,
      data.alterado_por_id,
      data.descricao || null,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query(
      "SELECT * FROM reservation_logs ORDER BY id ASC"
    );
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM reservation_logs WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async findByReservationId(reserva_id) {
    const query =
      "SELECT * FROM reservation_logs WHERE reserva_id = $1 ORDER BY data_alteracao ASC";
    const result = await db.query(query, [reserva_id]);
    return result.rows;
  },

  async delete(id) {
    const query = "DELETE FROM reservation_logs WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
