const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {requireAuth} = require('../middleware/auth');

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Provide a default value for development

const TOKEN_EXP = '7d';

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'student' }
    });

    const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_EXP });

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, username, password } = req.body;
    email = typeof email === 'string' ? email.trim() : ''
    username = typeof username === 'string' ? username.trim() : ''
    if (!password || (!email && !username)) {
      return res.status(400).json({ error: 'Provide email or username and password' });
    }

    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (username) {
      user = await prisma.user.findFirst({ where: { name: { equals: username, mode: 'insensitive' } } });
    }

    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: TOKEN_EXP });

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role },token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Note: removed redundant /check-user endpoint — login now validates username+email and password

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

router.get('/check',requireAuth, (req, res) => {
  res.json({ ok: true,user: req.user });
});

module.exports = router;
