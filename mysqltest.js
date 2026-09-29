require('dotenv').config()
const mysql = require('mysql')
// --filename-- .env (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
if (!process.env.MYSQL_PASSWORD) throw new Error('Set MYSQL_PASSWORD in .env.')

const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
})
