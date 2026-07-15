import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
