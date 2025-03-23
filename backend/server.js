const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Auth0 JWT validation middleware

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faqdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });

// Public routes

// Example route with role check

// Protected routes - require authentication
app.use('/api/faqs',  require('./routes/faqRoutes'));
app.use('/api/metrics',  require('./routes/metricRoutes'));  

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token, or no token supplied' });
  }
  res.status(500).json({ message: 'An unexpected error occurred' });
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));