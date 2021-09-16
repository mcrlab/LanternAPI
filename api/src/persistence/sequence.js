const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async insert(wait, data) {
    try {
      const timestamp = Date.now() / 1000.0;
      const {rows} = await db.query(sql`
      INSERT INTO sequence ( wait, data, complete, created )
      VALUES ( ${wait}, ${data}, FALSE, to_timestamp(${timestamp}) )
      RETURNING *;
      `);
      const [sequence] = rows;
      return sequence;
    } catch (error) {
      if (error.constraint === 'id') {
        return null;
      }

      throw error;
    }
  },
  
  async complete(id) {
    const { rows } = await db.query(sql`
      UPDATE sequence 
      SET complete = TRUE
      WHERE id = ${id}
      RETURNING *;
    `);
    return rows[0];
  },

  async next() {
    const {rows} = await db.query(sql`
    SELECT * FROM sequence WHERE complete=FALSE ORDER BY created LIMIT 1;
    `);
    return rows[0];
  },


  async clear(id){
    const { rows } = await  db.query(sql`
      DELETE FROM sequence
      RETURNING *
    `);
    return rows;
  },


};