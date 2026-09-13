import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    sort: '',
  });

  const categories = [
    'كهرباء', 'سباكة', 'نجارة', 'دهان', 'تكييف',
    'برمجة', 'تصميم', 'ترجمة', 'تعليم', 'صحة',
    'سيارات', 'نقل', 'تنظيف', 'طبخ', 'أخرى',
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);
      if (filters.sort) params.append('sort', filters.sort);

      const { data } = await api.get(`/services?${params.toString()}`);
      setServices(data.services);
    } catch (error) {
      toast.error('حدث خطأ في جلب الخدمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', city: '', sort: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">تصفح الخدمات</h1>
        <p className="text-gray-600">ابحث عن الخدمة المناسبة لك</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="ابحث عن خدمة..."
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">كل الفئات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* City */}
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="المدينة..."
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">الأحدث</option>
              <option value="price_asc">الأرخص أولاً</option>
              <option value="price_desc">الأغلى أولاً</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            مسح الفلاتر
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">جاري التحميل...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <p className="text-xl text-gray-500 mb-2">لا توجد خدمات</p>
          <p className="text-gray-400">جرب البحث بكلمات أخرى</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            عدد النتائج: <span className="font-bold">{services.length}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service._id}
                to={`/services/${service._id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  {service.rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold">{service.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={16} />
                    <span>{service.city}</span>
                  </div>

                  <div className="flex items-center gap-1 text-blue-600 font-bold">
                    <span className="text-lg">{service.price}</span>
                    <span className="text-xs text-gray-500">ج.س/{service.priceUnit}</span>
                  </div>
                </div>

                {service.provider && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {service.provider.name?.charAt(0)}
                    </div>
                    <span>{service.provider.name}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Services;