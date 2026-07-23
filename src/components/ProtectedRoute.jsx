import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function ProtectedRoute({ requireAdmin = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
