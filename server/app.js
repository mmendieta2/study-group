const path = require('node:path');
const express = require('express');
const session = require('express-session');

require('./db/database'); // opens the database and creates tables on startup

const app = express();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Unknown /api routes get a JSON error instead of an HTML page
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// The frontend. Keep this LAST so the API routes above win.
app.use(express.static(path.join(__dirname, '..', 'client')));

module.exports = app;