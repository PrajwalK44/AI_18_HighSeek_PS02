const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
