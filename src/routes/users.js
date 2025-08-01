const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const sort = req.query.sort === 'last_login_desc' ? 'last_login DESC NULLS LAST' : 'last_login DESC NULLS LAST';
    const { rows } = await db.query(
      `SELECT id, name, email, status, last_login, created_at FROM users ORDER BY ${sort}`
    );
    res.json({ users: rows });
  } catch (err) {
    next(err);
  }
});

router.patch('/block', async (req, res, next) => {
  try {
    const { ids } = req.body; // array of user ids
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs required' });
    }
    await db.query(`UPDATE users SET status='blocked' WHERE id = ANY($1::uuid[])`, [ids]);
    res.json({ message: `Blocked ${ids.length} users` });
  } catch (err) {
    next(err);
  }
});

router.patch('/unblock', async (req, res, next) => {
  try {
    const { ids } = req.body;
    await db.query(`UPDATE users SET status='active' WHERE id = ANY($1::uuid[])`, [ids]);
    res.json({ message: `Unblocked ${ids.length} users` });
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { ids } = req.body;
    await db.query(`UPDATE users SET status='deleted' WHERE id = ANY($1::uuid[])`, [ids]);
    res.json({ message: `Deleted ${ids.length} users` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
