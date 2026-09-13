import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// صفحة بسيطة مؤقتة (سنستبدلها قريباً)
const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          مرحباً {user?.name} 👋
        </h1>
        <p className="text-gray-600 mb-2">
          البريد: {user?.email}
        </p>
        <p className="text-gray-600 mb-6">
          الدور: {user?.role === 'provider' ? 'مقدم خدمة' : user?.role === 'admin' ? 'أدمن' : 'عميل'}
        </p>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

// صفحة محمية
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// صفحة عامة (لا يدخلها المستخدم المسجل)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;