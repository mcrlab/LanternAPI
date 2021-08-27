const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async create(id, current_color, pixels, version, last_updated) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO lights (id, current_color, pixels, version, x, y, sleep, last_updated)
      VALUES (${id}, ${current_color}, ${pixels}, ${version}, 0.5, 0.5, 0, to_timestamp(${last_updated}))
      RETURNING *;
      `);
      const [light] = rows;
      return light;
    } catch (error) {
      if (error.constraint === 'id') {
        return null;
      }

      throw error;
    }
  },
  
  async update(id, current_color, pixels, version, x, y, sleep, last_updated) {
    const { rows } = await db.query(sql`
      UPDATE lights 
      SET (id, current_color, pixels, version, x, y, sleep, last_updated) = (${id}, ${current_color}, ${pixels}, ${version}, ${x}, ${y}, ${sleep}, to_timestamp(${last_updated}))
      WHERE id = ${id}
      RETURNING *;
    `);
    return rows[0];
  },

  async delete(id){
    const { rows } = await  db.query(sql`
      DELETE FROM lights
      WHERE id = ${id}
      RETURNING *
    `);
    return rows;
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