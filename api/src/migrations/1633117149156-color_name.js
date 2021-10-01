'use strict'
const db = require('../persistence/db');
const sql = require('sql-template-strings');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE lights RENAME COLUMN current_color to color;
  `);

  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE lights RENAME COLUMN color to current_color;
  `);

  await client.release(true);
  next()
}
