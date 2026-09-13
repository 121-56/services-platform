import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            إنشاء حساب
          </h1>
          <p className="text-gray-500">انضم إلى منصة خدمات ومهن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="أحمد محمد"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">رقم الهاتف</label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="09xxxxxxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••"
              />
            </div>
          </div>

<div>
            <label className="block text-gray-700 font-medium mb-2">نوع الحساب</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="client">عميل (أبحث عن خدمات)</option>
              <option value="provider">مقدم خدمة (أقدم خدمات)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'جاري التحميل...' : (
              <>
                <UserPlus size={20} />
                إنشاء حساب
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              سجل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;