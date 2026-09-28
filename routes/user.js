const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT userEmail, userFirstName, userLastName, userTel, DATE_FORMAT(dateOfBirth, "%Y-%m-%d") AS dateOfBirth FROM `user` ORDER BY userEmail'
    );
    return res.status(200).json(users);
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

router.post('/', async (req, res) => {
  const { userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth } = req.body || {};
  if ([userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth]
    .some((value) => typeof value !== 'string' || !value.trim())) {
    return res.status(400).json({ error: 'Missing mandatory fields' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) || userEmail.length > 85) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!/^[a-zA-Z0-9]{8,15}$/.test(userPassword)) {
    return res.status(400).json({ error: 'Password must be 8–15 alphanumeric characters' });
  }
  const birthDate = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    ? new Date(`${dateOfBirth}T00:00:00Z`) : new Date(NaN);
  if (userFirstName.length > 50 || userLastName.length > 50 || userTel.length > 50 ||
      Number.isNaN(birthDate.getTime()) ||
      birthDate.toISOString().slice(0, 10) !== dateOfBirth) {
    return res.status(400).json({ error: 'Invalid registration details' });
  }

  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    await pool.execute(
      'INSERT INTO `user` (userEmail, userPassword, userFirstName, userLastName, userTel, dateOfBirth) VALUES (?, ?, ?, ?, ?, ?)',
      [userEmail.trim(), hashedPassword, userFirstName.trim(), userLastName.trim(), userTel.trim(), dateOfBirth]
    );
    return res.status(201).json({ message: 'Created' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    console.error('Failed to register user:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
