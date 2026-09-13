import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Star, Clock, ArrowRight, User, Phone,
  Mail, Calendar, FileText, X
} from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    description: '',
    scheduledDate: '',
    address: '',
    notes: '',
  });

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/services/${id}`);
      setService(data.service);
    } catch (error) {
      toast.error('الخدمة غير موجودة');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleOrderChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      await api.post('/orders', {
        serviceId: id,
        ...orderData,
      });
      toast.success('تم إنشاء الطلب بنجاح!');
      setShowOrderModal(false);
      navigate('/my-orders');
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ';
      toast.error(message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  }

  if (!service) return null;

  const isProvider = user?.role === 'provider';
  const isOwner = user?._id === service.provider?._id;
  const canOrder = !isProvider && !isOwner;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">الرئيسية</Link>
        <ArrowRight size={14} />
        <Link to="/services" className="hover:text-blue-600">الخدمات</Link>
        <ArrowRight size={14} />
        <span className="text-gray-700">{service.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full">
                {service.category}
              </span>
              {service.rating > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={18} fill="currentColor" />
                  <span className="font-bold">{service.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {service.title}
            </h1>

            <p className="text-gray-600 leading-relaxed mb-6">
              {service.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={18} className="text-blue-600" />
                <span>{service.city}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-blue-600" />
                <span>{service.priceUnit}</span>
              </div>
            </div>
          </div>
          {/* Provider Info */}
          {service.provider && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                مقدم الخدمة
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {service.provider.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {service.provider.name}
                  </h3>
                  {service.provider.city && (
                    <p className="text-gray-500 flex items-center gap-1 text-sm">
                      <MapPin size={14} />
                      {service.provider.city}
                    </p>
                  )}
                </div>
              </div>

              {canOrder && service.provider.phone && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone size={16} className="text-blue-600" />
                    {service.provider.phone}
                  </p>
                  {service.provider.email && (
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      <Mail size={16} className="text-blue-600" />
                      {service.provider.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm mb-1">السعر</p>
              <p className="text-4xl font-bold text-blue-600">
                {service.price}
              </p>
              <p className="text-gray-500 text-sm">
                ج.س / {service.priceUnit}
              </p>
            </div>

            {canOrder ? (
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                اطلب الخدمة الآن
              </button>
            ) : isOwner ? (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700 font-medium">
                  هذه خدمتك الخاصة
                </p>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">
                  لا يمكنك طلب الخدمة (أنت مقدم خدمة)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                طلب الخدمة
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  وصف الطلب *
                </label>
                <textarea
                  name="description"
                  value={orderData.description}
                  onChange={handleOrderChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="اشرح ما تحتاجه بالتفصيل..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  تاريخ التنفيذ *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={orderData.scheduledDate}
                  onChange={handleOrderChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  name="address"
                  value={orderData.address}
                  onChange={handleOrderChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="الحي، الشارع، رقم المنزل"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  name="notes"
                  value={orderData.notes}
                  onChange={handleOrderChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="أي تفاصيل أخرى..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition"
                >
                  {orderLoading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;