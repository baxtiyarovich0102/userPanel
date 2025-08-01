const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email va password bo\'sh bo\'lmasligi kerak' });
    }
    if (password.length === 0) {
      return res.status(400).json({ message: 'Password non-empty bo\'lishi kerak' });
    }

    const hashed = await bcrypt.hash(password, 8); 

    const insertText = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, status, last_login, created_at
    `;
    const values = [name, email, hashed];
    const result = await db.query(insertText, values);
    const user = result.rows[0];
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email va parol kerak' });

    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER($1)';
    const { rows } = await db.query(query, [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (user.status === 'blocked') return res.status(403).json({ message: 'Account blocked' });
    if (user.status === 'deleted') return res.status(403).json({ message: 'Account deleted' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // update last_login
    await db.query('UPDATE users SET last_login = now() WHERE id = $1', [user.id]);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, status: user.status } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
