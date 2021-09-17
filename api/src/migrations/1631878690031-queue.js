'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE sequence
    RENAME TO queue;
  `);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE queue
    RENAME TO sequence;
  `);

  await client.release(true);
  next()
}
