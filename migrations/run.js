require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });
  const sql = fs.readFileSync(path.join(__dirname, '001_schema.sql'), 'utf8');
  await conn.query(sql);
  console.log('Schema migration complete');
  await conn.end();
}

run().catch(console.error);
