const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'وصف الطلب مطلوب'],
    maxlength: 1000,
  },
  scheduledDate: {
    type: Date,
    required: [true, 'تاريخ التنفيذ مطلوب'],
  },
  address: {
    type: String,
    required: [true, 'العنوان مطلوب'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);