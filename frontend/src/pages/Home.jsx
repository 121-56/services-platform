import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Search, Star, Shield, Zap, Users } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ابحث عن الخدمة التي تحتاجها
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            منصة تربطك بأفضل مقدمي الخدمات في منطقتك
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition inline-flex items-center justify-center gap-2"
            >
              <Search size={22} />
              تصفح الخدمات
            </Link>

            {user?.role === 'provider' && (
              <Link
                to="/create-service"
                className="bg-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition inline-flex items-center justify-center gap-2"
              >
                <Briefcase size={22} />
                أضف خدمتك
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      {user && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              مرحباً {user.name} 👋
            </h2>
            <p className="text-gray-600">
              {user.role === 'provider'
                ? 'أضف خدماتك وابدأ باستقبال الطلبات من العملاء.'
                : 'ابحث عن الخدمات التي تحتاجها واطلبها بسهولة.'}
            </p>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          لماذا منصتنا؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">سريع وسهل</h3>
            <p className="text-gray-600">
              ابحث عن الخدمة المناسبة واحصل عليها في دقائق
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">موثوق وآمن</h3>
            <p className="text-gray-600">
              جميع مقدمي الخدمات تم التحقق منهم لضمان الجودة
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md text-center hover:shadow-xl transition">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">تقييمات حقيقية</h3>
            <p className="text-gray-600">
              اقرأ تقييمات العملاء السابقين قبل اختيار مقدم الخدمة
            </p>
          </div>
        </div>
      </section>
      {/* CTA */}
      {!user && (
        <section className="bg-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Users size={64} className="text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ابدأ الآن مجاناً
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              انضم إلى آلاف العملاء ومقدمي الخدمات
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition border-2 border-blue-600"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;