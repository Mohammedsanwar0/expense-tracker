require("dotenv").config();
const { Pool } = require("pg");

// A Pool keeps a small set of open connections ready to reuse, instead of
// opening/closing a new connection for every single query.
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

module.exports = pool;
