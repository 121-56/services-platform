import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Package, Clock, XCircle } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/my-orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('حدث خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء الطلب؟')) return;

    try {
      await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
      toast.success('تم إلغاء الطلب');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
      accepted: { text: 'مقبول', color: 'bg-blue-100 text-blue-700' },
      in_progress: { text: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-700' },
      completed: { text: 'مكتمل', color: 'bg-green-100 text-green-700' },
      cancelled: { text: 'ملغي', color: 'bg-red-100 text-red-700' },
      rejected: { text: 'مرفوض', color: 'bg-gray-100 text-gray-700' },
    };
    const info = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.color}`}>
        {info.text}
      </span>
    );
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">طلباتي</h1>
        <p className="text-gray-600">تابع حالة طلباتك هنا</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: 'قيد الانتظار' },
          { key: 'accepted', label: 'مقبولة' },
          { key: 'in_progress', label: 'قيد التنفيذ' },
          { key: 'completed', label: 'مكتملة' },
          { key: 'cancelled', label: 'ملغية' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">جاري التحميل...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">لا توجد طلبات</p>
          <Link to="/services" className="text-blue-600 hover:underline">
            تصفح الخدمات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {order.service?.title}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {order.service?.category}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {order.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-blue-600" />
                  {new Date(order.scheduledDate).toLocaleDateString('ar-EG')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="text-blue-600" />
                  {order.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-blue-600" />
                  {order.service?.priceUnit}
                </div>
                <div className="text-sm font-bold text-blue-600">
                  {order.totalPrice} ج.س
                </div>
              </div>

              {order.provider && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {order.provider.name?.charAt(0)}
                    </div>
                    <span>{order.provider.name}</span>
                  </div>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-medium transition"
                    >
                      <XCircle size={16} />
                      إلغاء
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;