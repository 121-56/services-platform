const Order = require('../models/Order');
const Service = require('../models/Service');

// ✅ إنشاء طلب جديد (العميل فقط)
exports.createOrder = async (req, res) => {
  try {
    const { serviceId, description, scheduledDate, address, notes } = req.body;

    if (!serviceId || !description || !scheduledDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة',
      });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك طلب خدمتك الخاصة',
      });
    }

    const order = await Order.create({
      client: req.user._id,
      provider: service.provider,
      service: serviceId,
      description,
      scheduledDate,
      address,
      notes: notes || '',
      totalPrice: service.price,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء الطلب',
      error: error.message,
    });
  }
};

// ✅ طلباتي (العميل)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ client: req.user._id })
      .populate('provider', 'name email phone avatar')
      .populate('service', 'title category price priceUnit')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب طلباتك',
      error: error.message,
    });
  }
};

// ✅ الطلبات الواردة (مقدم الخدمة)
exports.getIncomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ provider: req.user._id })
      .populate('client', 'name email phone avatar')
      .populate('service', 'title category price priceUnit')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الطلبات الواردة',
      error: error.message,
    });
  }
};
// ✅ الحصول على طلب واحد
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email phone avatar')
      .populate('provider', 'name email phone avatar')
      .populate('service', 'title category price priceUnit');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    // التحقق من الصلاحية
    const userId = req.user._id.toString();
    if (
      order.client._id.toString() !== userId &&
      order.provider._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بعرض هذا الطلب',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الطلب',
      error: error.message,
    });
  }
};

// ✅ تحديث حالة الطلب
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ['accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة الطلب غير صالحة',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    const userId = req.user._id.toString();
    const isProvider = order.provider.toString() === userId;
    const isClient = order.client.toString() === userId;

    if (!isProvider && !isClient && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذا الطلب',
      });
    }

    // العميل يمكنه فقط الإلغاء
    if (isClient && !isProvider && status !== 'cancelled') {
      return res.status(403).json({
        success: false,
        message: 'العميل يمكنه فقط إلغاء الطلب',
      });
    }

    order.status = status;
    if (status === 'completed') {
      order.completedAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث الطلب',
      error: error.message,
    });
  }
};