const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, priceUnit, city } = req.body;

    if (!title || !description || !category || !price || !city) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة',
      });
    }

    const service = await Service.create({
      provider: req.user._id,
      title,
      description,
      category,
      price,
      priceUnit: priceUnit || 'ساعة',
      city,
    });

    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء الخدمة',
      error: error.message,
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search, sort } = req.query;

    let query = { isAvailable: true };

    if (category) query.category = category;
    if (city) query.city = new RegExp(city, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortBy = { createdAt: -1 };
    if (sort === 'price_asc') sortBy = { price: 1 };
    if (sort === 'price_desc') sortBy = { price: -1 };
    if (sort === 'rating') sortBy = { rating: -1 };

    const services = await Service.find(query)
      .populate('provider', 'name email avatar phone')
      .sort(sortBy);

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الخدمات',
      error: error.message,
    });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name email avatar phone city');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة',
      });
    }

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب الخدمة',
      error: error.message,
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة',
      });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بتعديل هذه الخدمة',
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث الخدمة',
      error: error.message,
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة',
      });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذه الخدمة',
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'تم حذف الخدمة بنجاح',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف الخدمة',
      error: error.message,
    });
  }
};

exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب خدماتك',
      error: error.message,
    });
  }
};