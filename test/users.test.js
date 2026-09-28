require('dotenv').config();
const { expect } = require('chai');
const request = require('supertest');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { sampleUsers } = require('../scripts/setup-db');

// Tests use a separate database so real registration data is never deleted.
const baseName = process.env.DB_NAME || 'se_course_db';
if (!/^[a-zA-Z0-9_]+$/.test(baseName)) throw new Error('Invalid database name');
process.env.DB_NAME = `${baseName}_test`;
const app = require('../app');
const pool = require('../db');
let admin;

describe('User API integration tests', function () {
  before(async function () {
    admin = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await pool.query('CREATE TABLE IF NOT EXISTS `user` (userEmail VARCHAR(85) NOT NULL PRIMARY KEY, userPassword VARCHAR(72) NOT NULL, userFirstName VARCHAR(50) NOT NULL, userLastName VARCHAR(50) NOT NULL, userTel VARCHAR(50) NOT NULL, dateOfBirth DATE NOT NULL)');
  });

  beforeEach(async function () {
    await pool.query('DELETE FROM `user`');
    for (const [email, password, firstName, lastName, tel, birth] of sampleUsers) {
      await pool.execute('INSERT INTO `user` VALUES (?, ?, ?, ?, ?, ?)',
        [email, await bcrypt.hash(password, 4), firstName, lastName, tel, birth]);
    }
  });

  after(async function () {
    await pool.end();
    if (admin) await admin.end();
  });

  it('IT-1 GET /users returns 3 users without passwords', async function () {
    const response = await request(app).get('/users');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array').with.lengthOf(3);
    for (const user of response.body) expect(user).not.to.have.property('userPassword');
  });

  it('IT-2 POST /users creates a user and hashes the password', async function () {
    const response = await request(app).post('/users').send({
      userEmail: 'newstudent@example.com', userPassword: 'newpass123',
      userFirstName: 'New', userLastName: 'Student', userTel: '0812345678', dateOfBirth: '2004-01-01'
    });
    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Created');
    const [users] = await pool.execute('SELECT userPassword FROM `user` WHERE userEmail = ?', ['newstudent@example.com']);
    expect(users[0].userPassword).not.to.equal('newpass123');
    expect(await bcrypt.compare('newpass123', users[0].userPassword)).to.equal(true);
    const [count] = await pool.query('SELECT COUNT(*) AS total FROM `user`');
    expect(count[0].total).to.equal(4);
  });

  it('IT-3 POST /users rejects an existing email', async function () {
    const response = await request(app).post('/users').send({
      userEmail: 'daranporn@gmail.com', userPassword: 'newpass123',
      userFirstName: 'Duplicate', userLastName: 'Student', userTel: '0812345678', dateOfBirth: '2004-01-01'
    });
    expect(response.status).to.equal(409);
    expect(response.body.error).to.match(/already exists/i);
  });

  it('IT-4 POST /users rejects incomplete data', async function () {
    const response = await request(app).post('/users').send({ userEmail: 'newstudent@example.com' });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.match(/mandatory/i);
  });
});
