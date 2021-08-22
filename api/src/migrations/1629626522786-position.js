'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE lights 
    ADD COLUMN x DECIMAL,
    ADD COLUMN y DECIMAL;
  `);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE lights
    DROP COLUMN x,
    DROP COLUMN y;
  `);

  await client.release(true);
  next()
}
