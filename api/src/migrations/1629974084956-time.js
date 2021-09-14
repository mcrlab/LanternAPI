'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE lights 
    ADD COLUMN last_updated TIMESTAMP;
  `);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE lights
    DROP COLUMN last_updated;
  `);

  await client.release(true);
  next()
}
