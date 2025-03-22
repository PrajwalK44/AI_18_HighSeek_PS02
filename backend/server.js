const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

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

app.use('/api/faqs', require('./routes/faqRoutes'));

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
