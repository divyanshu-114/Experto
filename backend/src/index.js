require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS: allow frontend origin (adjust to your dev origin)
// prefer env var FRONTEND_ORIGIN; fall back to common dev ports
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const allowed = [FRONTEND_ORIGIN, 'http://localhost:5174'];

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser (e.g. Postman) requests when origin is undefined
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));



app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
