require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'barna_db',
    multipleStatements: true,
  });
  const sql = fs.readFileSync(path.join(__dirname, '002_seed.sql'), 'utf8');
  await conn.query(sql);
  console.log('Seed complete');
  await conn.end();
}

seed().catch(console.error);
