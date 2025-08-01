require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Public: register / login
app.use('/api', authRoutes);

// Protected
app.use(authMiddleware); 
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === '23505') { 
    return res.status(400).json({ message: 'E-mail allaqachon ishlatilgan' });
  }
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
