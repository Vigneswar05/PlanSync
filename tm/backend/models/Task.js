const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userEmail: String,
  title: String,
  task: String,
  status: String,
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
