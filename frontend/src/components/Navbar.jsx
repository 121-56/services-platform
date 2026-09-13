import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, LogOut, User, PlusCircle, List, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Briefcase size={28} />
            <span>منصة خدمات ومهن</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <Home size={18} />
              <span className="hidden md:inline">الرئيسية</span>
            </Link>

            <Link
              to="/services"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <List size={18} />
              <span className="hidden md:inline">الخدمات</span>
            </Link>

            {user?.role === 'provider' && (
              <Link
                to="/create-service"
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
              >
                <PlusCircle size={18} />
                <span className="hidden md:inline">أضف خدمة</span>
              </Link>
            )}

            {user && (
              <>
                <Link
                  to="/my-orders"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                >
                  <List size={18} />
                  <span className="hidden md:inline">طلباتي</span>
                </Link>

                <div className="border-r border-gray-300 mx-2 h-8"></div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                    <User size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                      {user.name}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                    title="تسجيل الخروج"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;