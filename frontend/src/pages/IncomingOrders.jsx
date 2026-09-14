import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Calendar, MapPin, Package, Clock, Phone,
  CheckCircle, XCircle, PlayCircle, Flag
} from 'lucide-react';

const IncomingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/incoming');
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ في جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus, successMessage) => {
    if (!window.confirm(`هل أنت متأكد من ${successMessage}؟`)) return;
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(successMessage);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
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

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">الطلبات الواردة</h1>
        <p className="text-gray-600">تابع الطلبات من العملاء وقم بإدارتها</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'الكل' },
          { key: 'pending', label: 'قيد الانتظار' },
          { key: 'accepted', label: 'مقبولة' },
          { key: 'in_progress', label: 'قيد التنفيذ' },
          { key: 'completed', label: 'مكتملة' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">جاري التحميل...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">لا توجد طلبات</p>
          <p className="text-gray-400 text-sm">
            عندما يطلب العميل خدمة من خدماتك، ستظهر هنا
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {order.service?.title || 'خدمة محذوفة'}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {order.service?.category || '-'}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <p className="text-gray-600 text-sm mb-4">{order.description}</p>

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
                  {order.service?.priceUnit || '-'}
                </div>
                <div className="text-sm font-bold text-blue-600">
                  {order.totalPrice} ج.س
                </div>
              </div>

              {order.client && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">معلومات العميل:</p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {order.client.name?.charAt(0)}
                      </div>
                      <span className="font-medium">{order.client.name}</span>
                    </div>
                    {order.client.phone && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone size={14} />
                        {order.client.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {order.status === 'pending' && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(order._id, 'accepted', 'تم قبول الطلب')}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    <CheckCircle size={18} />
                    قبول الطلب
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, 'rejected', 'تم رفض الطلب')}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    <XCircle size={18} />
                    رفض
                  </button>
                </div>
              )}

              {order.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(order._id, 'in_progress', 'بدأ تنفيذ الطلب')}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    <PlayCircle size={18} />
                    بدء التنفيذ
                  </button>
                </div>
              )}
              {order.status === 'in_progress' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(order._id, 'completed', 'تم إكمال الطلب')}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                  >
                    <Flag size={18} />
                    إكمال الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingOrders;