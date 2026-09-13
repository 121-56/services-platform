const jwt = require('jsonwebtoken');
const User = require('../models/User');

// حماية المسارات - التحقق من التوكن
exports.protect = async (req, res, next) => {
  let token;
  
  // قراءة التوكن من Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // التحقق من وجود التوكن
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح بالدخول - لا يوجد توكن',
    });
  }
  
  try {
    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن المستخدم
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'توكن غير صالح',
    });
  }
};

// تحديد الأدوار المسموح لها
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:` الدور "${req.user.role}" غير مصرح له بالوصول`,
      });
    }
    next();
  };
};