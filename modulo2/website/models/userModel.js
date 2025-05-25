const db = require("../config/db");

module.exports = {
  async create(data) {
    const query =
      "INSERT INTO users (nome, email, matricula, tipo) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [data.nome, data.email, data.matricula, data.tipo];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    return result.rows;
  },

  async findById(id) {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const query =
      "UPDATE users SET nome = $1, email = $2, matricula = $3, tipo = $4 WHERE id = $5 RETURNING *";
    const values = [data.nome, data.email, data.matricula, data.tipo, id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = "DELETE FROM users WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};
