const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async create(address, current_color, version, last_updated, config) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO lights (address, current_color, version, x, y, sleep, last_updated, config)
      VALUES (${address}, ${current_color}, ${version}, 0.5, 0.5, 0, to_timestamp(${last_updated}), ${config})
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
  
  async update(address, current_color, version, last_updated, config) {
    const { rows } = await db.query(sql`
      UPDATE lights 
      SET (current_color, version, last_updated, config) = (${current_color}, ${version},  to_timestamp(${last_updated}), ${config})
      WHERE address = ${address}
      RETURNING *;
    `);
    return rows[0];
  },

  async updatePosition(id, x, y){
    const { rows } = await db.query(sql`
    UPDATE lights 
    SET (x, y) = (${x}, ${y})
    WHERE id = ${id}
    RETURNING *;
  `);
  return rows[0]; 
  },

  async updateSleep(id, sleep){
    const { rows } = await db.query(sql`
    UPDATE lights 
    SET (sleep) = (${sleep})
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

  async findByAddress(address) {
    const {rows} = await db.query(sql`
    SELECT * FROM lights WHERE address=${address} LIMIT 1;
    `);
    return rows[0];
  },

  async all() {
    const {rows} = await db.query(sql`SELECT * FROM lights`);
    return rows;
  }
};