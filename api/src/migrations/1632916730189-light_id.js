'use strict'
const db = require('../persistence/db');
const sql = require('sql-template-strings');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`
    ALTER TABLE public.lights DROP CONSTRAINT lights_pkey;
  `);

  await client.query(`
    ALTER TABLE lights RENAME COLUMN id to address;
  `);

  await client.query(`
    ALTER TABLE lights ADD COLUMN id SERIAL PRIMARY KEY;
  `);

  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    ALTER TABLE public.lights DROP CONSTRAINT lights_pkey;
  `);

  await client.query(`
    ALTER TABLE lights RENAME COLUMN address to id;
  `);

  await client.query(`
    ALTER TABLE lights DROP COLUMN address;
  `);

  await client.release(true);
  next()
}
