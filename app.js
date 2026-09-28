const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/user', userRouter);
app.post('/signup', (req, res, next) => {
  req.url = '/';
  userRouter(req, res, next);
});
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Invalid JSON' });
  return res.status(500).json({ error: 'Server error' });
});

module.exports = app;
