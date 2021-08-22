'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS lights (
      id text PRIMARY KEY,
      name text,
      current_color VARCHAR(6),
      pixels INT,
      version VARCHAR(10)
    );
  `);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE lights;
  `);

  await client.release(true);
  next()
}
