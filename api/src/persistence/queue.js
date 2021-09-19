const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async insert(wait, data) {
    try {
      const timestamp = Date.now() / 1000.0;
      const {rows} = await db.query(sql`
      INSERT INTO queue ( wait, data, complete, created )
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
      UPDATE queue 
      SET complete = TRUE
      WHERE id = ${id};
    `);
    return rows[0];
  },

  async next() {
    const {rows} = await db.query(sql`
    SELECT * FROM queue WHERE complete=FALSE ORDER BY created LIMIT 1;
    `);
    return rows[0];
  },


  async clear(){
    const { rows } = await  db.query(sql`
      DELETE FROM queue
      RETURNING *
    `);
    return rows;
  },

  async wait(){
    const { rows } = await  db.query(sql`
    SELECT SUM(wait) as total 
    FROM queue
    WHERE complete=FALSE;
  `);
  if(rows[0].total === null) return 0;
  return rows[0].total;
  },

  async count(){
    const { rows } = await  db.query(sql`
    SELECT COUNT(*) as total 
    FROM queue
    WHERE complete=FALSE;
  `);
  console.log(rows[0].total)

  return rows[0].total;
  },

  async total(){
    const { rows } = await  db.query(sql`
    SELECT COUNT(*) as total 
    FROM queue;
  `);
  return rows[0].total;
  }


};