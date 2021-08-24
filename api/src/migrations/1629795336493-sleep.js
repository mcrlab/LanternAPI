'use strict'
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE lights 
    ADD COLUMN sleep INT DEFAULT 0 NOT NULL;
  `);
  await client.query(`
  UPDATE lights 
  SET sleep = 0
  WHERE sleep IS NULL;
`);
  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE lights
    DROP COLUMN sleep,
  `);

  await client.release(true);
  next()
}
