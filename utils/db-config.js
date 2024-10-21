const mysql = require("mysql2/promise");
require("dotenv").config({ path: require("find-config")(".env") });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  multipleStatements: false,
  waitForConnections: true,
});

module.exports = pool;
