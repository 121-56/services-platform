const User = require('../models/User');
const jwt = require('jsonwebtoken');

// إنشاء JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// إرسال التوكن مع بيانات المستخدم
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // إخفاء كلمة المرور
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// ✅ التسجيل
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // التحقق من المدخلات
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال الاسم والبريد وكلمة المرور',
      });
    }
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل مسبقاً',
      });
    }
    
    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role || 'client',
    });
    
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في التسجيل',
      error: error.message,
    });
  }
};

// ✅ تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // التحقق من المدخلات
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد وكلمة المرور',
      });
    }
    
    // البحث عن المستخدم مع كلمة المرور
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'البريد أو كلمة المرور غير صحيحة',
      });
    }
    
    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد أو كلمة المرور غير صحيحة',
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تسجيل الدخول',
      error: error.message,
    });
  }
};

// ✅ الحصول على بيانات المستخدم الحالي
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ',
      error: error.message,
    });
  }
};