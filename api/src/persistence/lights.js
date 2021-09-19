const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async create(id, current_color, version, last_updated, config) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO lights (id, current_color, version, x, y, sleep, last_updated, config)
      VALUES (${id}, ${current_color}, ${version}, 0.5, 0.5, 0, to_timestamp(${last_updated}), ${config})
      RETURNING *;
      `);
      const [light] = rows;
      return light;
    } catch (error) {
      if (error.constraint === 'id') {
        return null;
      }
      console.log(`
      INSERT INTO lights (id, current_color, version, x, y, sleep, last_updated, config)
      VALUES (${id}, ${current_color}, ${version}, 0.5, 0.5, 0, to_timestamp(${last_updated}), ${config})
      RETURNING *;
      `);

      throw error;
    }
  },
  
  async update(id, current_color, version, x, y, sleep, last_updated, config) {
    const { rows } = await db.query(sql`
      UPDATE lights 
      SET (id, current_color, version, x, y, sleep, last_updated, config) = (${id}, ${current_color}, ${version}, ${x}, ${y}, ${sleep}, to_timestamp(${last_updated}), ${config})
      WHERE id = ${id}
      RETURNING *;
    `);
    return rows[0];
  },

  async updatePosition(id, x, y){
    const { rows } = await db.query(sql`
    UPDATE lights 
    SET (id, x, y) = (${id}, ${x}, ${y})
    WHERE id = ${id}
    RETURNING *;
  `);
  return rows[0]; 
  },

  async updateColor(id, color) {
    const { rows } = await db.query(sql`
      UPDATE lights 
      SET current_color = ${color}
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