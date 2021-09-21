'use strict'
const db = require('../persistence/db');
const sql = require('sql-template-strings');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS colors (
      id SERIAL PRIMARY KEY,
      name text,
      hexcode VARCHAR(6)
    );
  `);

  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE colors;
  `);

  await client.release(true);
  next()
}
