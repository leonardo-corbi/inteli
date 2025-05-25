const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO rooms (nome, localizacao, capacidade, recursos) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [
      data.nome,
      data.localizacao,
      data.capacidade,
      data.recursos || null,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM rooms ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM rooms WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const query =
      "UPDATE rooms SET nome = $1, localizacao = $2, capacidade = $3, recursos = $4 WHERE id = $5 RETURNING *";
    const values = [
      data.nome,
      data.localizacao,
      data.capacidade,
      data.recursos || null,
      id,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM rooms WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
