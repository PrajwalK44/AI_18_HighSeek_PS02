const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Auth0 JWT validation middleware
// Uncomment and configure this for production
/*
const jwtCheck = auth({
  audience: 'your-api-identifier',
  issuerBaseURL: 'https://your-domain.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// Protect all routes except auth
app.use((req, res, next) => {
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }
  jwtCheck(req, res, next);
});
*/

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/faqdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ Error connecting to MongoDB:', error.message);
});

// API routes
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/metrics', require('./routes/metricRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token, or no token supplied' });
  }
  
  // Generic error handler
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    message: err.message || 'An unexpected error occurred',
    status: statusCode
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});