const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO reservations (sala_id, usuario_id, data_inicio, data_fim, status) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      data.sala_id,
      data.usuario_id,
      data.data_inicio,
      data.data_fim,
      data.status,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM reservations ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM reservations WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const query =
      "UPDATE reservations SET sala_id = $1, usuario_id = $2, data_inicio = $3, data_fim = $4, status = $5 WHERE id = $6 RETURNING *";
    const values = [
      data.sala_id,
      data.usuario_id,
      data.data_inicio,
      data.data_fim,
      data.status,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM reservations WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
