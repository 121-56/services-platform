import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, DollarSign, MapPin, FileText, Tag } from 'lucide-react';

const CreateService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'كهرباء',
    price: '',
    priceUnit: 'ساعة',
    city: '',
  });

  const categories = [
    'كهرباء', 'سباكة', 'نجارة', 'دهان', 'تكييف',
    'برمجة', 'تصميم', 'ترجمة', 'تعليم', 'صحة',
    'سيارات', 'نقل', 'تنظيف', 'طبخ', 'أخرى',
  ];

  const priceUnits = ['ساعة', 'يوم', 'مشروع', 'زيارة'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
      };
      await api.post('/services', payload);
      toast.success('تم إنشاء الخدمة بنجاح!');
      navigate('/services');
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إضافة خدمة جديدة
          </h1>
          <p className="text-gray-600">
            املأ البيانات التالية لعرض خدمتك للعملاء
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              عنوان الخدمة *
            </label>
            <div className="relative">
              <FileText className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="مثال: تركيب وصيانة كهرباء منزلية"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              وصف الخدمة *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="اشرح تفاصيل الخدمة التي تقدمها..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.description.length}/1000
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              الفئة *
            </label>
            <div className="relative">
              <Tag className="absolute right-3 top-3 text-gray-400" size={20} />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                السعر (ج.س) *
              </label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="150"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                وحدة السعر *
              </label>
              <select
                name="priceUnit"
                value={formData.priceUnit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {priceUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              المدينة *
            </label>
            <div className="relative">
              <MapPin className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="مثال: الخرطوم"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'جاري الحفظ...' : 'إضافة الخدمة'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;