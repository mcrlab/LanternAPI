'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS sequence (
      id SERIAL PRIMARY KEY,
      wait INT,
      data JSON,
      complete BOOLEAN,
      created TIMESTAMP
    );
  `);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE sequence;
  `);

  await client.release(true);
  next()
}
