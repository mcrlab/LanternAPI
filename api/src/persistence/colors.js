const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async all() {
    const {rows} = await db.query(sql`
    SELECT * FROM colors;
    `);
    return rows;
  },
  async insert(name, hexcode) {
    try {

      const {rows} = await db.query(sql`
      INSERT INTO colors ( name, hexcode )
      VALUES ( ${name}, ${hexcode})
      RETURNING *;
      `);

      return rows;
    } catch (error) {
      if (error.constraint === 'id') {
        return null;
      }

      throw error;
    }
  },

};