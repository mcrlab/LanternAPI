const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async create(id, current_color, pixels, version) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO lights (id, current_color, pixels, version)
      VALUES (${id}, ${current_color}, ${pixels}, ${version})
      RETURNING *;
      `);
      const [light] = rows;
      console.log(rows);
      return light;
    } catch (error) {
      if (error.constraint === 'id') {
        return null;
      }

      throw error;
    }
  },
  
  async update(id, current_color, pixels, version) {
    const { rows } = await db.query(sql`
      UPDATE lights 
      SET (id, current_color, pixels, version) = (${id}, ${current_color}, ${pixels}, ${version})
      WHERE id = ${id}
      RETURNING *;
    `);
    return rows[0];
  },

  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM lights WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },

  async all() {
    const {rows} = await db.query(sql`SELECT * FROM lights`);
    return rows;
  }
};