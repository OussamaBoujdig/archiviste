require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const companiesRoutes = require('./routes/companies');
const usersRoutes = require('./routes/users');
const foldersRoutes = require('./routes/folders');
const documentsRoutes = require('./routes/documents');
const activityRoutes = require('./routes/activity');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AmanDocs API'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     🗄️  AmanDocs API Server               ║
  ╠═══════════════════════════════════════════╣
  ║  ✅ Server running on port ${PORT}            ║
  ║  📁 Environment: ${process.env.NODE_ENV || 'development'}          ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
