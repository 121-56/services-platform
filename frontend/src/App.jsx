import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import CreateService from './pages/CreateService';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">جاري التحميل...</p></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-xl">جاري التحميل...</p></div>;
  return user ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
      <Route path="/services/:id" element={<ProtectedRoute><Layout><ServiceDetails /></Layout></ProtectedRoute>} />
      <Route path="/create-service" element={<ProtectedRoute><Layout><CreateService /></Layout></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><Layout><MyOrders /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;