const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'عنوان الخدمة مطلوب'],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, 'وصف الخدمة مطلوب'],
    maxlength: 1000,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'كهرباء',
      'سباكة',
      'نجارة',
      'دهان',
      'تكييف',
      'برمجة',
      'تصميم',
      'ترجمة',
      'تعليم',
      'صحة',
      'سيارات',
      'نقل',
      'تنظيف',
      'طبخ',
      'أخرى',
    ],
  },
  price: {
    type: Number,
    required: [true, 'السعر مطلوب'],
    min: 0,
  },
  priceUnit: {
    type: String,
    enum: ['ساعة', 'يوم', 'مشروع', 'زيارة'],
    default: 'ساعة',
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  images: [{
    type: String,
    default: [],
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// فهرس البحث
serviceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Service', serviceSchema);