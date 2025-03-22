// models/QueryMetric.js
const mongoose = require('mongoose');

const queryMetricSchema = new mongoose.Schema({
  department: { type: String, required: true },
  count: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QueryMetric', queryMetricSchema);