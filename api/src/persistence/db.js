const {Pool} = require('pg');

const poolConfig = {
  max: 10,
  connectionString: process.env.DATABASE_URL
}

if(process.env.NODE_ENV==="production"){
  poolConfig.ssl = { rejectUnauthorized: false };
}
module.exports = new Pool(poolConfig);