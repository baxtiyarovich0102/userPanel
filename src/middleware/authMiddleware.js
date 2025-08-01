const jwt = require('jsonwebtoken');
const db = require('../db');

async function authMiddleware(req, res, next) {
  const openPaths = ['/api/login', '/api/register'];
  if (openPaths.includes(req.path)) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Not authenticated' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const user = rows[0];
    if (!user || user.status === 'blocked' || user.status === 'deleted') {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
