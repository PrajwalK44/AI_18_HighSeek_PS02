const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  department: { type: String, required: true },
  tags: [String],
});

module.exports = mongoose.model('FAQ', faqSchema);
