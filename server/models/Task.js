const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String }, // We will encrypt this manually in controller
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Index for search performance
taskSchema.index({ title: 'text' });

module.exports = mongoose.model('Task', taskSchema);