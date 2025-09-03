require('dotenv').config();
console.log('Environment loaded, JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');


const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const codeforcesRoutes = require('./src/routes/codeforces');
const geminiRoutes = require('./src/routes/gemini');
const userRoutes = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Regular middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());
try {
  require('./src/config/passport')(passport);
  console.log('Passport config loaded successfully');
} catch (error) {
  console.error('Error loading passport config:', error);
}
require('./src/config/database')(passport);

// Routes
app.use('/auth', authRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});