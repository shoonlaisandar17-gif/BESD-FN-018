require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const sampleUsers = [
  ['daranporn@gmail.com', 'yjdf1716', 'Sira', 'Weerakittana', '0891234567', '2012-05-26'],
  ['boonpoj@gmail.com', 'mmjt9876', 'Rosanan', 'Suvanabhumivong', '0641825563', '2011-10-17'],
  ['bodin_thai@gmail.com', 'mmyb4577', 'Tankwan', 'Srisuk', '0986345661', '2007-04-29']
];

async function main() {
  const dbName = process.env.DB_NAME || 'se_course_db';
  if (!/^[a-zA-Z0-9_]+$/.test(dbName)) throw new Error('Invalid database name');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
    await connection.query('CREATE TABLE IF NOT EXISTS `user` (userEmail VARCHAR(85) NOT NULL PRIMARY KEY, userPassword VARCHAR(72) NOT NULL, userFirstName VARCHAR(50) NOT NULL, userLastName VARCHAR(50) NOT NULL, userTel VARCHAR(50) NOT NULL, dateOfBirth DATE NOT NULL)');
    for (const [email, password, firstName, lastName, tel, birth] of sampleUsers) {
      await connection.execute(
        'INSERT IGNORE INTO `user` (userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth) VALUES (?, ?, ?, ?, ?, ?)',
        [email, await bcrypt.hash(password, 10), firstName, lastName, tel, birth]
      );
    }
    console.log(`Database ${dbName} ready with three sample users.`);
  } finally {
    await connection.end();
  }
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { main, sampleUsers };
